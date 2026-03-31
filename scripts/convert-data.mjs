/**
 * 一次性脚本：将 backend/temp/full-data.json 转换为前端静态数据模块
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// 1. 读取数据库导出的唐代完整数据
const rawTang = JSON.parse(fs.readFileSync(path.join(ROOT, 'backend/temp/full-data.json'), 'utf8'));
console.log(`[唐代] 读取到 ${rawTang.length} 个顶层节点`);

// 2. 构建唐代朝代对象（包装皇帝根节点）
const tang = {
    id: 'tang',
    name: '唐朝',
    structure: {
        id: 'tang_emperor',
        title: '皇帝',
        englishTitle: 'The Emperor',
        level: '最高统治者',
        bgImage: '/assets/ui/emperor-bg.png',
        hideText: true,
        hideBorder: true,
        description: '封建社会的最高统治者，掌握全国军政大权。',
        children: rawTang
    }
};

// 3. 明代数据 — 从旧 data.js 手工迁移（保持原有内容不丢失）
const ming = {
    id: 'ming',
    name: '明朝',
    structure: {
        id: 'ming_emperor',
        title: '皇帝',
        level: '最高统治者',
        bgImage: '/assets/ui/emperor-bg.png',
        hideText: true,
        hideBorder: true,
        description: '大明朝最高独裁者，大权独揽。',
        children: [
            {
                id: 'neige', title: '内阁', type: 'admin', level: '正五品(初)至正一品',
                description: '起初仅为皇帝顾问，后掌握"票拟"大权，成为事实上的宰相机构。长官为内阁首辅。',
                figures: ['解缙 (永乐)', '杨士奇 (仁宣)', '张居正 (万历)'],
                allusions: [{ title: '票拟与批红', text: '内阁大学士在奏折上拟定处理意见称为"票拟"，交由皇帝（或代笔太监）用红笔批示称为"批红"。内阁借此掌握了国家实际政务大权。' }],
                poetry: [{ author: '解缙', poem: '墙上芦苇，头重脚轻根底浅；\n山间竹笋，嘴尖皮厚腹中空。' }],
                children: [
                    {
                        id: 'shoufu', title: '内阁首辅职位', level: '正一品',
                        description: '内阁的首领，权倾朝野，掌握处理全国政务最高权力的人。',
                        figures: ['严嵩', '张居正'],
                        allusions: [{ title: '万历新政', text: '张居正担任首辅期间，推行考成法、一条鞭法，使得明朝国库充盈，边防巩固，是明代最著名的政治家之一。' }],
                        poetry: [{ author: '张居正', poem: '愿以深心奉尘刹，不予自身求利益。' }]
                    },
                    { id: 'cifu', title: '内阁次辅', level: '从一品', description: '地位仅次于首辅的内阁大学士。' }
                ]
            },
            {
                id: 'liubu', title: '六 部', type: 'admin', level: '正二品',
                description: '明太祖废中书省后，六部直接对皇帝负责。各部尚书为长官。',
                children: [
                    { id: 'm_libu', title: '吏 部', type: 'personnel', level: '正二品', description: '掌管全国官吏的任免、考选、升降、调动等职，被誉为"天官"，位列六部之首。', figures: ['海瑞 (曾任吏部右侍郎)'], allusions: [{ title: '海瑞罢官', text: '海瑞一生刚直不阿，在任用官员和整顿吏治方面铁面无私，深得民心，但也屡遭贬谪。' }], poetry: [{ author: '海瑞', poem: '三生不改冰霜操，万死常留社稷身。' }] },
                    { id: 'm_hubu', title: '户 部', type: 'finance', level: '正二品', description: '掌管天下土地、户籍、赋税、财政收支。' },
                    { id: 'm_libu2', title: '礼 部', type: 'rites', level: '正二品', description: '掌管典章法度、祭祀、学校、科举和外宾接待。' },
                    { id: 'm_bingbu', title: '兵 部', type: 'military', level: '正二品', description: '掌管武官选用，调兵权仍在皇帝手中。', panelImage: '/assets/content/bingbu_rider.png' },
                    { id: 'm_xingbu', title: '刑  部', type: 'justice', level: '正二品', description: '主管全国刑罚、法律政令。' },
                    { id: 'm_gongbu', title: '工  部', type: 'public_works', level: '正二品', description: '主管工程营造、水利建设。' }
                ]
            },
            {
                id: 'zhengyuan', title: '都察院', type: 'supervisory', level: '正二品',
                description: '最高监察机构，主掌弹劾及建言，与六科给事中合称"科道"。', children: []
            },
            {
                id: 'changwei', title: '厂卫', type: 'intelligence', level: '特务机构',
                description: '明代特有的宦官（东厂、西厂等）与武职（锦衣卫）侦缉机构，直接听命于皇帝。',
                figures: ['魏忠贤 (东厂提督)', '纪纲 (锦衣卫指挥使)'],
                allusions: [{ title: '锦衣夜行', text: '锦衣卫不仅负责皇帝仪仗，更拥有诏狱，可以越过正常的司法程序直接逮捕、审讯官员，制造了诸多冤假错案。' }],
                poetry: [{ author: '明人（无名氏）', poem: '缇骑四出，天下骚动。' }],
                children: []
            }
        ]
    }
};

// 4. 输出
const output = `/**
 * 静态官制数据 (Static Dynasty Data)
 * 
 * 数据来源：原 Directus/PostgreSQL 数据库全量导出 (backend/temp/full-data.json)
 * 砍掉后端依赖后，由前端直接硬编码加载。
 */

export const dynastyData = ${JSON.stringify([tang, ming], null, 4)};
`;

fs.writeFileSync(path.join(ROOT, 'src/data/dynastyData.js'), output, 'utf8');
const size = fs.statSync(path.join(ROOT, 'src/data/dynastyData.js')).size;
console.log(`✅ 已写入 src/data/dynastyData.js (${(size / 1024).toFixed(1)} KB)`);
