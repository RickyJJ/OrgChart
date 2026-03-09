/**
 * Directus API 客户端
 * 负责从 Directus 拉取官制数据并重建前端所需的嵌套树结构
 *
 * 策略：两次独立请求（org_nodes + lores）后在前端合并，
 * 避开 Directus v11 关系字段需要特殊权限配置的问题。
 */

const DIRECTUS_URL = 'http://127.0.0.1:8055';

// ─── 基础请求函数 ────────────────────────────────────────
async function directusFetch(path) {
    const res = await fetch(`${DIRECTUS_URL}${path}`);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Directus API error: ${res.status} on ${path}\n${text}`);
    }
    const json = await res.json();
    return json.data;
}

// ─── 将扁平节点列表重建为嵌套树 ──────────────────────────
function buildTree(nodes) {
    const nodeMap = {};
    for (const node of nodes) {
        nodeMap[node.id] = { ...node, children: [] };
    }

    const roots = [];
    for (const node of nodes) {
        const mappedNode = nodeMap[node.id];
        if (node.parent_id && nodeMap[node.parent_id]) {
            nodeMap[node.parent_id].children.push(mappedNode);
        } else if (!node.parent_id) {
            roots.push(mappedNode);
        }
    }

    // 对每层子节点按 sort_order 排序
    const sortChildren = (n) => {
        n.children.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        n.children.forEach(sortChildren);
    };
    roots.forEach(sortChildren);

    return roots[0] || null;
}

// ─── 将 DB 节点格式转换为前端 Node 格式 ──────────────────
function transformNode(dbNode, loresMap) {
    const lores = loresMap.get(dbNode.id) || [];
    return {
        id: dbNode.id,
        title: dbNode.title,
        englishTitle: dbNode.english_title || undefined,
        level: dbNode.level || undefined,
        description: dbNode.description || undefined,
        type: dbNode.type || undefined,
        bgImage: dbNode.bg_image || undefined,
        panelImage: dbNode.panel_image || undefined,
        hideText: dbNode.hide_text || false,
        hideBorder: dbNode.hide_border || false,
        figures: lores.filter(l => l.type === 'figure').map(l => l.title),
        allusions: lores
            .filter(l => l.type === 'allusion')
            .map(l => ({ title: l.title, text: l.content, loreImage: l.lore_image || undefined })),
        poetry: lores
            .filter(l => l.type === 'poetry')
            .map(l => ({ author: l.title, poem: l.content })),
        children: [], // 由 buildTree 填充
    };
}

// ─── 递归地对树节点应用 transform ───────────────────────
function transformTree(node, loresMap) {
    const transformed = transformNode(node, loresMap);
    transformed.children = node.children.map(child => transformTree(child, loresMap));
    return transformed;
}

// ─── 主入口：拉取指定朝代的完整数据 ─────────────────────
export async function fetchDynastyData(dynastyId) {
    // 两次独立请求，避开关系字段权限问题
    const [nodes, lores] = await Promise.all([
        directusFetch(`/items/org_nodes?filter[dynasty_id][_eq]=${dynastyId}&limit=-1`),
        directusFetch(`/items/lores?limit=-1`),
    ]);

    // 过滤出属于该朝代节点的 lores（通过 org_node_id 匹配）
    const nodeIds = new Set(nodes.map(n => n.id));
    const filteredLores = lores.filter(l => nodeIds.has(l.org_node_id));

    // 建立 org_node_id → lores[] 的 Map
    const loresMap = new Map();
    for (const lore of filteredLores) {
        const nodeId = lore.org_node_id;
        if (!loresMap.has(nodeId)) loresMap.set(nodeId, []);
        loresMap.get(nodeId).push(lore);
    }

    // 重建树结构
    const tree = buildTree(nodes);
    if (!tree) throw new Error(`No root node found for dynasty: ${dynastyId}`);

    // 转换格式
    return transformTree(tree, loresMap);
}

// ─── 拉取所有朝代列表 ────────────────────────────────────
export async function fetchDynasties() {
    return await directusFetch('/items/dynasties?limit=-1');
}

// ─── 拉取全量数据（组装成前端 dynastyData 格式）─────────
export async function fetchAllDynastiesData() {
    const dynasties = await fetchDynasties();

    const result = await Promise.all(
        dynasties.map(async (dynasty) => {
            const structure = await fetchDynastyData(dynasty.id);
            return {
                id: dynasty.id,
                name: dynasty.name,
                structure,
            };
        })
    );

    return result;
}

// ─── 拉取已上架商品列表（造办处用）─────────────────────────
export async function fetchProducts() {
    const products = await directusFetch(
        '/items/products?filter[status][_eq]=published&sort=sort&limit=-1'
    );

    // 为含有 image UUID 的商品拼接完整图片 URL
    return products.map((p) => ({
        ...p,
        imageUrl: p.image
            ? `${DIRECTUS_URL}/assets/${p.image}?width=600&quality=80`
            : null,
    }));
}

// ─── 埋点上报（fire-and-forget 风格）────────────────────────
export async function trackEvent(eventName, payload = {}) {
    try {
        let uuid = null;
        try {
            uuid = localStorage.getItem('qyz_anon_id');
        } catch { /* silent */ }

        const res = await fetch(`${DIRECTUS_URL}/items/tracking_events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uuid: uuid || 'unknown',
                event_name: eventName,
                payload,
            }),
        });

        if (!res.ok) {
            console.warn('[埋点] 上报失败:', res.status);
        }
    } catch (err) {
        // 埋点不影响主流程
        console.warn('[埋点] 上报异常:', err.message);
    }
}
