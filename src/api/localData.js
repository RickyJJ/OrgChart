/**
 * 本地化数据适配层 (Local Data Adapter)
 * 
 * 替代原 directus.js 的所有 API 调用，保持完全一致的函数签名。
 * 所有数据从前端硬编码 JSON 同步读取，埋点降级为 console.log。
 * 
 * 恢复数据库模式时，只需将各组件的 import 路径切回 './directus' 即可。
 */

import { dynastyData as rawDynastyData } from '../data/dynastyData';
import { staticProducts } from '../data/products';

// 初始化时执行递归风流人物的向上汇聚 (Roll-up)
// 保证在具体职务上的风流人物能自动在机构长辈上显示
const processedDynastyData = JSON.parse(JSON.stringify(rawDynastyData));

const rollUpFigures = (node) => {
    const figuresSet = new Set(Array.isArray(node.figures) ? node.figures : []);

    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            const childFigures = rollUpFigures(child);
            for (const f of childFigures) {
                figuresSet.add(f);
            }
        }
    }

    const mergedFigures = Array.from(figuresSet);
    if (mergedFigures.length > 0) {
        node.figures = mergedFigures;
    }
    
    return mergedFigures;
};

/**
 * 递归计算 hasHiddenLore 字段
 * 如果子孙节点中有 allusions 或 poetry，则父节点 hasHiddenLore 为 true
 * 返回当前节点及其所有子孙是否包含任何典故数据
 */
const calculateHiddenLore = (node) => {
    let selfHasLore = (Array.isArray(node.allusions) && node.allusions.length > 0) || 
                      (Array.isArray(node.poetry) && node.poetry.length > 0);
    
    let childrenHaveLore = false;
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            if (calculateHiddenLore(child)) {
                childrenHaveLore = true;
            }
        }
    }

    // hasHiddenLore 指的是“子孙节点中有典故”
    node.hasHiddenLore = childrenHaveLore;

    // 返回给父级：我自己有或者我子孙有
    return selfHasLore || childrenHaveLore;
};

for (const dynasty of processedDynastyData) {
    rollUpFigures(dynasty.structure);
    calculateHiddenLore(dynasty.structure);
}

// ─── 拉取全量朝代数据（同步，但包裹为 Promise 以保持 API 兼容）───
export async function fetchAllDynastiesData() {
    return processedDynastyData;
}

// ─── 拉取商品列表 ────────────────────────────────────────
export async function fetchProducts() {
    // 从 localStorage 读取本地点赞增量并合并
    const localLikes = _getLocalLikes();
    return staticProducts.map(p => ({
        ...p,
        likes_count: (p.likes_count || 0) + (localLikes[p.id] || 0),
    })).sort((a, b) => b.likes_count - a.likes_count);
}

// ─── 点赞（纯 localStorage 实现）──────────────────────────
export async function toggleProductLike(productId, newCount) {
    try {
        const localLikes = _getLocalLikes();
        // 找到原始静态值
        const original = staticProducts.find(p => p.id === productId);
        const baseLikes = original ? (original.likes_count || 0) : 0;
        localLikes[productId] = newCount - baseLikes;
        localStorage.setItem('qyz_local_likes', JSON.stringify(localLikes));
        return true;
    } catch (err) {
        console.warn('[点赞-离线] 本地存储异常:', err.message);
        return false;
    }
}

// ─── 搜索节点（本地遍历匹配）──────────────────────────────
export async function searchNodes(query) {
    if (!query || !query.trim()) return [];

    const normalized = query.trim().toLowerCase().replace(/\s+/g, '');
    const results = [];

    const walk = (node) => {
        if (!node) return;
        const title = (node.title || '').toLowerCase().replace(/\s+/g, '');
        const desc = (node.description || '').toLowerCase().replace(/\s+/g, '');
        const figures = Array.isArray(node.figures) ? node.figures.join(' ').toLowerCase() : '';

        if (title.includes(normalized) || desc.includes(normalized) || figures.includes(normalized)) {
            results.push({
                id: node.id,
                title: node.title,
                level: node.level,
                description: node.description,
                salary: node.salary,
            });
        }
        if (Array.isArray(node.children)) {
            node.children.forEach(walk);
        }
    };

    for (const dynasty of processedDynastyData) {
        walk(dynasty.structure);
    }

    return results.slice(0, 5);
}

// ─── 埋点上报（降级为 console.log）──────────────────────────
export async function trackEvent(eventName, payload = {}) {
    if (import.meta.env.DEV) {
        console.log(`[埋点-离线] ${eventName}`, payload);
    }
}

// ─── 内部辅助 ─────────────────────────────────────────────
function _getLocalLikes() {
    try {
        const raw = localStorage.getItem('qyz_local_likes');
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}
