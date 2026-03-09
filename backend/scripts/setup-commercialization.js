/**
 * 商业化阶段建表脚本 (Commercialization Schema Setup)
 * 
 * 在 Directus 中创建 products 和 tracking_events 两个集合，
 * 并配置 Public Role 的对应权限。
 *
 * 用法: node scripts/setup-commercialization.js
 */

const DIRECTUS_URL = 'http://127.0.0.1:8055';
const ADMIN_EMAIL = 'admin@qingyunzhi.com';
const ADMIN_PASSWORD = 'admin';

// ─── Helper ────────────────────────────────────────────────
async function login() {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    const json = await res.json();
    return json.data.access_token;
}

async function api(token, method, path, body) {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${DIRECTUS_URL}${path}`, opts);
    const text = await res.text();

    if (!res.ok) {
        // If 409 conflict, collection already exists - skip
        if (res.status === 409 || res.status === 403) {
            console.log(`  ⚠️  跳过 (${res.status}): ${path} — 可能已存在`);
            return null;
        }
        throw new Error(`API Error ${res.status} on ${method} ${path}: ${text}`);
    }

    try { return JSON.parse(text); } catch { return text; }
}

// ─── 1. Create Collections ────────────────────────────────

async function createProductsCollection(token) {
    console.log('\n📦 创建 products (商品陈列表) ...');

    // Create the collection
    await api(token, 'POST', '/collections', {
        collection: 'products',
        meta: {
            icon: 'shopping_bag',
            note: '造办处文创商品展列',
            sort_field: 'sort',
            archive_field: 'status',
            archive_value: 'archived',
            unarchive_value: 'draft',
        },
        schema: {},
    });

    // Create fields
    const fields = [
        {
            field: 'name',
            type: 'string',
            meta: { interface: 'input', note: '商品名称（如"大唐通宝折扇"）', required: true, sort: 1, width: 'half' },
            schema: { is_nullable: false },
        },
        {
            field: 'description',
            type: 'text',
            meta: { interface: 'input-rich-text-md', note: '商品古风文案描述', sort: 2, width: 'full' },
            schema: {},
        },
        {
            field: 'image',
            type: 'uuid',
            meta: { interface: 'file-image', note: '关联 Directus Files 的封面图', sort: 3, width: 'half', special: ['file'] },
            schema: {},
            relation: { related_collection: 'directus_files' },
        },
        {
            field: 'external_url',
            type: 'string',
            meta: { interface: 'input', note: '外部电商跳转链接', sort: 4, width: 'full' },
            schema: {},
        },
        {
            field: 'status',
            type: 'string',
            meta: {
                interface: 'select-dropdown',
                note: '上下架状态',
                sort: 5,
                width: 'half',
                options: {
                    choices: [
                        { text: '已上架', value: 'published' },
                        { text: '草稿', value: 'draft' },
                        { text: '已下架', value: 'archived' },
                    ],
                },
            },
            schema: { default_value: 'draft', is_nullable: false },
        },
        {
            field: 'sort',
            type: 'integer',
            meta: { interface: 'input', note: '排序权重', sort: 6, width: 'half', hidden: true },
            schema: {},
        },
        {
            field: 'price_display',
            type: 'string',
            meta: { interface: 'input', note: '展示价格文案（如"¥89"、"¥128 起"）', sort: 7, width: 'half' },
            schema: {},
        },
    ];

    for (const field of fields) {
        const relation = field.relation;
        delete field.relation;
        console.log(`  + 字段: ${field.field}`);
        await api(token, 'POST', '/fields/products', field);

        // Create relation for file fields
        if (relation) {
            await api(token, 'POST', '/relations', {
                collection: 'products',
                field: field.field,
                related_collection: relation.related_collection,
            });
        }
    }

    console.log('  ✅ products 集合创建完毕');
}

async function createTrackingEventsCollection(token) {
    console.log('\n📊 创建 tracking_events (埋点沉淀表) ...');

    await api(token, 'POST', '/collections', {
        collection: 'tracking_events',
        meta: {
            icon: 'analytics',
            note: '用户行为埋点追踪记录',
            singleton: false,
        },
        schema: {},
    });

    const fields = [
        {
            field: 'uuid',
            type: 'string',
            meta: { interface: 'input', note: '前端匿名追踪 ID', required: true, sort: 1, width: 'half' },
            schema: { is_nullable: false },
        },
        {
            field: 'event_name',
            type: 'string',
            meta: {
                interface: 'select-dropdown',
                note: '事件流名称',
                required: true,
                sort: 2,
                width: 'half',
                options: {
                    choices: [
                        { text: '查看商品', value: 'view_product' },
                        { text: '点击购买', value: 'click_buy' },
                        { text: '生成海报', value: 'generate_poster' },
                        { text: '点击模拟器 Banner', value: 'click_simulation_banner' },
                        { text: '进入造办处', value: 'enter_workshop' },
                    ],
                    allowOther: true,
                },
            },
            schema: { is_nullable: false },
        },
        {
            field: 'payload',
            type: 'json',
            meta: { interface: 'input-code', note: 'JSON 格式扩展数据（商品ID、来源页等）', sort: 3, width: 'full', options: { language: 'json' } },
            schema: {},
        },
    ];

    for (const field of fields) {
        console.log(`  + 字段: ${field.field}`);
        await api(token, 'POST', '/fields/tracking_events', field);
    }

    console.log('  ✅ tracking_events 集合创建完毕');
}

// ─── 2. Configure Public Permissions ──────────────────────

async function configurePublicPermissions(token) {
    console.log('\n🔐 配置 Public 角色权限 ...');

    // products: 只读
    console.log('  + products → Read (只读)');
    await api(token, 'POST', '/permissions', {
        role: null,  // null = Public role
        collection: 'products',
        action: 'read',
        fields: ['*'],
        permissions: { status: { _eq: 'published' } },
    });

    // tracking_events: 仅新增
    console.log('  + tracking_events → Create (仅新增)');
    await api(token, 'POST', '/permissions', {
        role: null,
        collection: 'tracking_events',
        action: 'create',
        fields: ['uuid', 'event_name', 'payload'],
        permissions: {},
    });

    // Also allow public read on directus_files for product images
    console.log('  + directus_files → Read (产品图片公开读)');
    await api(token, 'POST', '/permissions', {
        role: null,
        collection: 'directus_files',
        action: 'read',
        fields: ['*'],
        permissions: {},
    });

    console.log('  ✅ Public 权限配置完毕');
}

// ─── 3. Insert Sample Products ────────────────────────────

async function insertSampleProducts(token) {
    console.log('\n🎨 插入示例商品数据 ...');

    const products = [
        {
            name: '大唐通宝·水墨折扇',
            description: '取法唐代仕人雅趣，折扇面以徽州宣纸为骨，辅以淡墨山水意境。扇骨选用湘妃竹，典雅内敛。',
            external_url: 'https://taobao.com/example/fan-1',
            status: 'published',
            sort: 1,
            price_display: '¥128',
        },
        {
            name: '翰林题名·宣纸笔记本',
            description: '封面烫金「翰林院」字样，采用手工竹浆宣纸内页，书写触感温润如玉。适配钢笔与毛笔双用。',
            external_url: 'https://taobao.com/example/notebook-1',
            status: 'published',
            sort: 2,
            price_display: '¥68',
        },
        {
            name: '御史台·朱砂印章套装',
            description: '取御史台肃正之意，配以上等青田石料，篆刻"铁面无私"四字闲章。附赠印泥与锦盒。',
            external_url: 'https://taobao.com/example/seal-1',
            status: 'published',
            sort: 3,
            price_display: '¥198',
        },
        {
            name: '六部风云·水墨杯垫套组',
            description: '一套六枚，分别对应吏、户、礼、兵、刑、工六部。采用吸水硅藻土配合水墨印花工艺。',
            external_url: 'https://taobao.com/example/coaster-1',
            status: 'published',
            sort: 4,
            price_display: '¥89',
        },
        {
            name: '长安夜宴·香薰蜡烛',
            description: '调香灵感取自盛唐长安的花市与檀香。天然大豆蜡基底，持久燃烧约40小时。',
            external_url: 'https://taobao.com/example/candle-1',
            status: 'published',
            sort: 5,
            price_display: '¥58',
        },
        {
            name: '金榜题名·书签礼盒',
            description: '黄铜锻造，镂空设计。一套三枚分别刻有"状元"、"榜眼"、"探花"字样，送礼佳品。',
            external_url: 'https://taobao.com/example/bookmark-1',
            status: 'published',
            sort: 6,
            price_display: '¥45',
        },
    ];

    for (const product of products) {
        console.log(`  + ${product.name}`);
        await api(token, 'POST', '/items/products', product);
    }

    console.log('  ✅ 示例商品数据插入完毕');
}

// ─── Main ─────────────────────────────────────────────────

async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('  🏛️  青云志 · 商业化数据表建立脚本');
    console.log('═══════════════════════════════════════════════');

    const token = await login();
    console.log('🔑 Admin 登录成功');

    await createProductsCollection(token);
    await createTrackingEventsCollection(token);
    await configurePublicPermissions(token);
    await insertSampleProducts(token);

    console.log('\n═══════════════════════════════════════════════');
    console.log('  🎉 所有商业化数据表 & 权限配置完毕！');
    console.log('═══════════════════════════════════════════════');
}

main().catch((err) => {
    console.error('❌ 脚本执行失败:', err.message);
    process.exit(1);
});
