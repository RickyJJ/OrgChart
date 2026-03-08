/**
 * 《青云志》数据迁移脚本
 * ============================
 * 三阶段: Directus API 建表 → data.js 递归扁平化 → 批量导入
 *
 * 运行方式: node backend/scripts/migrate.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── 配置 ───────────────────────────────────────────────
const DIRECTUS_URL = 'http://127.0.0.1:8055';
const ADMIN_EMAIL = 'admin@qingyunzhi.com';
const ADMIN_PASSWORD = 'admin';

let ACCESS_TOKEN = '';

// ─── 工具函数 ─────────────────────────────────────────
async function api(path, method = 'GET', body = null) {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${DIRECTUS_URL}${path}`, opts);
    const text = await res.text();

    if (!res.ok) {
        console.error(`❌ API ${method} ${path} → ${res.status}`);
        console.error(text);
        throw new Error(`API error: ${res.status} on ${method} ${path}`);
    }
    return text ? JSON.parse(text) : null;
}

async function login() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const data = await res.json();
    ACCESS_TOKEN = data.data.access_token;
    console.log('✅ 已获取 Directus Admin Token');
}

// ─── 阶段一：通过 Directus API 创建集合 ──────────────────

async function createCollections() {
    console.log('\n══════════════════════════════════════');
    console.log('  阶段一：创建数据集合 (Collections)');
    console.log('══════════════════════════════════════\n');

    // --- 1. dynasties ---
    console.log('📦 创建 dynasties 集合...');
    await api('/collections', 'POST', {
        collection: 'dynasties',
        schema: {},
        meta: {
            icon: 'flag',
            note: '朝代字典表',
            singleton: false,
        },
    });

    // dynasties 的 id 字段已自动创建(integer auto-increment)，我们需要改为手动输入的 string
    // 先删除默认 id，再建自定义 id — 但 Directus 不允许删除PK
    // 所以我们在创建时通过 fields 来定义 PK
    // ⚠️ 实际上需要在创建集合时一同声明 fields

    // 删除再重建，用 fields 指定 PK 类型
    await api('/collections/dynasties', 'DELETE');

    await api('/collections', 'POST', {
        collection: 'dynasties',
        schema: {},
        meta: {
            icon: 'flag',
            note: '朝代字典表',
            singleton: false,
        },
        fields: [
            {
                field: 'id',
                type: 'string',
                schema: { is_primary_key: true, max_length: 32 },
                meta: { interface: 'input', required: true, note: '朝代代号，如 tang / ming' },
            },
            {
                field: 'name',
                type: 'string',
                schema: { max_length: 64 },
                meta: { interface: 'input', required: true, note: '显示名称，如 唐代' },
            },
        ],
    });
    console.log('  ✅ dynasties 集合已创建');

    // --- 2. org_nodes ---
    console.log('📦 创建 org_nodes 集合...');
    await api('/collections', 'POST', {
        collection: 'org_nodes',
        schema: {},
        meta: {
            icon: 'account_tree',
            note: '官阶职级树核心表',
            singleton: false,
        },
        fields: [
            {
                field: 'id',
                type: 'string',
                schema: { is_primary_key: true, max_length: 64 },
                meta: { interface: 'input', required: true, note: '官职唯一标识 (来自 data.js)' },
            },
            {
                field: 'dynasty_id',
                type: 'string',
                schema: { max_length: 32, foreign_key_table: 'dynasties', foreign_key_column: 'id' },
                meta: { interface: 'select-dropdown-m2o', required: true, note: '所属朝代' },
            },
            {
                field: 'title',
                type: 'string',
                schema: { max_length: 128 },
                meta: { interface: 'input', required: true, note: '官职中文名' },
            },
            {
                field: 'english_title',
                type: 'string',
                schema: { max_length: 256, is_nullable: true },
                meta: { interface: 'input', note: '英文名称' },
            },
            {
                field: 'level',
                type: 'string',
                schema: { max_length: 64, is_nullable: true },
                meta: { interface: 'input', note: '品阶' },
            },
            {
                field: 'description',
                type: 'text',
                schema: { is_nullable: true },
                meta: { interface: 'input-multiline', note: '职能白话翻译' },
            },
            {
                field: 'type',
                type: 'string',
                schema: { max_length: 32, is_nullable: true },
                meta: { interface: 'input', note: '类别标记 (admin / military / ...)' },
            },
            {
                field: 'path',
                type: 'string',
                schema: { data_type: 'ltree', is_nullable: true },
                meta: { interface: 'input', note: 'PostgreSQL ltree 路径' },
            },
            {
                field: 'parent_id',
                type: 'string',
                schema: { max_length: 64, is_nullable: true, foreign_key_table: 'org_nodes', foreign_key_column: 'id' },
                meta: { interface: 'select-dropdown-m2o', note: '父节点 ID' },
            },
            {
                field: 'bg_image',
                type: 'string',
                schema: { max_length: 512, is_nullable: true },
                meta: { interface: 'input', note: '背景图路径' },
            },
            {
                field: 'panel_image',
                type: 'string',
                schema: { max_length: 512, is_nullable: true },
                meta: { interface: 'input', note: '面板插图路径' },
            },
            {
                field: 'hide_text',
                type: 'boolean',
                schema: { default_value: false },
                meta: { interface: 'boolean', note: '是否隐藏标题文字' },
            },
            {
                field: 'hide_border',
                type: 'boolean',
                schema: { default_value: false },
                meta: { interface: 'boolean', note: '是否隐藏边框' },
            },
            {
                field: 'sort_order',
                type: 'integer',
                schema: { default_value: 0 },
                meta: { interface: 'input', note: '同级排序' },
            },
        ],
    });
    console.log('  ✅ org_nodes 集合已创建');

    // --- 3. lores ---
    console.log('📦 创建 lores 集合...');
    await api('/collections', 'POST', {
        collection: 'lores',
        schema: {},
        meta: {
            icon: 'auto_stories',
            note: '典故连珠 — 人物/典故/诗词',
            singleton: false,
        },
        fields: [
            {
                field: 'id',
                type: 'integer',
                schema: { is_primary_key: true, has_auto_increment: true },
                meta: { interface: 'input', hidden: true },
            },
            {
                field: 'org_node_id',
                type: 'string',
                schema: { max_length: 64, foreign_key_table: 'org_nodes', foreign_key_column: 'id' },
                meta: { interface: 'select-dropdown-m2o', required: true, note: '关联官职' },
            },
            {
                field: 'type',
                type: 'string',
                schema: { max_length: 16 },
                meta: { interface: 'select-dropdown', required: true, note: 'figure / allusion / poetry', options: { choices: [{ text: '人物', value: 'figure' }, { text: '典故', value: 'allusion' }, { text: '诗词', value: 'poetry' }] } },
            },
            {
                field: 'title',
                type: 'string',
                schema: { max_length: 256 },
                meta: { interface: 'input', required: true, note: '人名 / 典故标题 / 作者' },
            },
            {
                field: 'content',
                type: 'text',
                schema: { is_nullable: true },
                meta: { interface: 'input-multiline', note: '诗句或典故正文' },
            },
            {
                field: 'lore_image',
                type: 'string',
                schema: { max_length: 512, is_nullable: true },
                meta: { interface: 'input', note: '典故配图路径' },
            },
        ],
    });
    console.log('  ✅ lores 集合已创建');

    // --- 建立关系 (M2O) ---
    console.log('\n🔗 配置关系...');

    // org_nodes.dynasty_id → dynasties.id
    await api('/relations', 'POST', {
        collection: 'org_nodes',
        field: 'dynasty_id',
        related_collection: 'dynasties',
        meta: { one_field: 'org_nodes' },
        schema: { on_delete: 'CASCADE' },
    });
    console.log('  ✅ org_nodes.dynasty_id → dynasties');

    // org_nodes.parent_id → org_nodes.id (self-referencing)
    await api('/relations', 'POST', {
        collection: 'org_nodes',
        field: 'parent_id',
        related_collection: 'org_nodes',
        meta: { one_field: 'children' },
        schema: { on_delete: 'SET NULL' },
    });
    console.log('  ✅ org_nodes.parent_id → org_nodes (self)');

    // lores.org_node_id → org_nodes.id  
    await api('/relations', 'POST', {
        collection: 'lores',
        field: 'org_node_id',
        related_collection: 'org_nodes',
        meta: { one_field: 'lores' },
        schema: { on_delete: 'CASCADE' },
    });
    console.log('  ✅ lores.org_node_id → org_nodes');
}

// ─── 阶段二：data.js 递归扁平化清洗 ─────────────────────

function loadDataJs() {
    // data.js 使用 ESM export，我们手动解析内容
    const dataPath = resolve(__dirname, '../../src/data.js');
    const raw = readFileSync(dataPath, 'utf-8');

    // 将 export const dynastyData = [...] 转换为可 eval 的表达式
    const cleaned = raw
        .replace(/^export\s+const\s+dynastyData\s*=\s*/m, 'var dynastyData = ')
        .replace(/;\s*$/, '');

    // 使用 Function 构造器安全执行
    const fn = new Function(`${cleaned}; return dynastyData;`);
    return fn();
}

function flattenTree(dynastyData) {
    const dynasties = [];
    const orgNodes = [];
    const lores = [];

    for (const dynasty of dynastyData) {
        // 朝代字典
        dynasties.push({
            id: dynasty.id,
            name: dynasty.name,
        });

        const dynastyId = dynasty.id;

        // BFS 扁平化树 — 使用队列保证父节点先于子节点
        const queue = [];
        queue.push({
            node: dynasty.structure,
            parentId: null,
            pathPrefix: '',
            sortOrder: 0,
        });

        while (queue.length > 0) {
            const { node, parentId, pathPrefix, sortOrder } = queue.shift();

            // 生成 ltree path: 用英文 id 以点号连接
            // ltree 只允许 [a-zA-Z0-9_]，所以我们直接用 node.id
            const currentPath = pathPrefix ? `${pathPrefix}.${node.id}` : node.id;

            // org_nodes 记录
            orgNodes.push({
                id: node.id,
                dynasty_id: dynastyId,
                title: node.title,
                english_title: node.englishTitle || null,
                level: node.level || null,
                description: node.description || null,
                type: node.type || null,
                path: currentPath,
                parent_id: parentId,
                bg_image: node.bgImage || null,
                panel_image: node.panelImage || null,
                hide_text: node.hideText || false,
                hide_border: node.hideBorder || false,
                sort_order: sortOrder,
            });

            // 剥离 figures → lores (type: figure)
            if (node.figures && node.figures.length > 0) {
                for (const fig of node.figures) {
                    lores.push({
                        org_node_id: node.id,
                        type: 'figure',
                        title: fig,
                        content: null,
                        lore_image: null,
                    });
                }
            }

            // 剥离 allusions → lores (type: allusion)
            if (node.allusions && node.allusions.length > 0) {
                for (const a of node.allusions) {
                    lores.push({
                        org_node_id: node.id,
                        type: 'allusion',
                        title: a.title,
                        content: a.text || null,
                        lore_image: a.loreImage || null,
                    });
                }
            }

            // 剥离 poetry → lores (type: poetry)
            if (node.poetry && node.poetry.length > 0) {
                for (const p of node.poetry) {
                    lores.push({
                        org_node_id: node.id,
                        type: 'poetry',
                        title: p.author,
                        content: p.poem || null,
                        lore_image: null,
                    });
                }
            }

            // 加入子节点到队列
            if (node.children && node.children.length > 0) {
                node.children.forEach((child, idx) => {
                    queue.push({
                        node: child,
                        parentId: node.id,
                        pathPrefix: currentPath,
                        sortOrder: idx,
                    });
                });
            }
        }
    }

    return { dynasties, orgNodes, lores };
}

// ─── 阶段三：批量导入 ─────────────────────────────────

async function seedData(dynasties, orgNodes, lores) {
    console.log('\n══════════════════════════════════════');
    console.log('  阶段三：批量导入数据 (Bulk Seeding)');
    console.log('══════════════════════════════════════\n');

    // 1. 插入朝代字典
    console.log(`📥 插入 ${dynasties.length} 条朝代数据...`);
    await api('/items/dynasties', 'POST', dynasties);
    console.log('  ✅ dynasties 导入完成');

    // 2. 插入官职节点 — 必须按层级顺序（BFS 已保证父先子后）
    console.log(`📥 插入 ${orgNodes.length} 条官职节点...`);
    // Directus 批量插入可能因外键约束失败于自引用，所以逐条插入保证顺序
    for (let i = 0; i < orgNodes.length; i++) {
        const node = orgNodes[i];
        try {
            await api('/items/org_nodes', 'POST', node);
        } catch (err) {
            console.error(`  ⚠️ 插入节点 "${node.title}" (${node.id}) 失败:`, err.message);
        }
    }
    console.log('  ✅ org_nodes 导入完成');

    // 3. 插入典故/人物/诗词
    console.log(`📥 插入 ${lores.length} 条典故/人物/诗词数据...`);
    if (lores.length > 0) {
        await api('/items/lores', 'POST', lores);
    }
    console.log('  ✅ lores 导入完成');
}

// ─── 验证 ────────────────────────────────────────────

async function verify(expectedOrg, expectedLores) {
    console.log('\n══════════════════════════════════════');
    console.log('  验证阶段：数据完整性检查');
    console.log('══════════════════════════════════════\n');

    // 验证 dynasties
    const dRes = await api('/items/dynasties?limit=-1');
    console.log(`  朝代: 期望 2, 实际 ${dRes.data.length} ${dRes.data.length === 2 ? '✅' : '❌'}`);

    // 验证 org_nodes
    const oRes = await api('/items/org_nodes?limit=-1');
    console.log(`  官职节点: 期望 ${expectedOrg}, 实际 ${oRes.data.length} ${oRes.data.length === expectedOrg ? '✅' : '❌'}`);

    // 验证 lores
    const lRes = await api('/items/lores?limit=-1');
    console.log(`  典故/人物/诗词: 期望 ${expectedLores}, 实际 ${lRes.data.length} ${lRes.data.length === expectedLores ? '✅' : '❌'}`);

    // 验证 ltree 路径可查
    const ltreeRes = await api('/items/org_nodes?filter[path][_starts_with]=tang_emperor.shangshu');
    console.log(`  ltree 路径查询 (tang_emperor.shangshu*): 返回 ${ltreeRes.data.length} 条 ${ltreeRes.data.length > 0 ? '✅' : '❌'}`);
    for (const n of ltreeRes.data) {
        console.log(`    └─ ${n.title} (${n.path})`);
    }

    // 验证关系能查出嵌套数据
    const relRes = await api('/items/org_nodes?filter[id][_eq]=zhongshu&fields=*,lores.*');
    if (relRes.data.length > 0) {
        const node = relRes.data[0];
        console.log(`  关系查询 (中书省 + lores): ${node.lores?.length || 0} 条关联 ${(node.lores?.length || 0) > 0 ? '✅' : '⚠️'}`);
    }

    console.log('\n🎉 数据迁移全部完成！');
}

// ─── Main ────────────────────────────────────────────

async function main() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║  《青云志》 data.js → Directus 数据迁移  ║');
    console.log('╚══════════════════════════════════════════╝\n');

    // Step 0: 登录
    await login();

    // Step 1: 建表
    await createCollections();

    // Step 2: 扁平化清洗
    console.log('\n══════════════════════════════════════');
    console.log('  阶段二：data.js 递归扁平化清洗');
    console.log('══════════════════════════════════════\n');

    const dynastyData = loadDataJs();
    console.log(`📜 成功加载 data.js，包含 ${dynastyData.length} 个朝代`);

    const { dynasties, orgNodes, lores } = flattenTree(dynastyData);
    console.log(`  → 朝代: ${dynasties.length}`);
    console.log(`  → 官职节点: ${orgNodes.length}`);
    console.log(`  → 典故/人物/诗词: ${lores.length}`);

    // 输出清洗预览
    console.log('\n📋 官职节点预览:');
    for (const n of orgNodes.slice(0, 8)) {
        console.log(`  ${n.path} → ${n.title} (${n.level || '-'})`);
    }
    if (orgNodes.length > 8) console.log(`  ... 共 ${orgNodes.length} 条`);

    // Step 3: 导入数据
    await seedData(dynasties, orgNodes, lores);

    // Step 4: 验证
    await verify(orgNodes.length, lores.length);
}

main().catch((err) => {
    console.error('\n💥 迁移脚本执行失败:', err);
    process.exit(1);
});
