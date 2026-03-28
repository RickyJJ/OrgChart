/**
 * 古今职业映射字典 (Modern-to-Ancient Job Mapping Dictionary)
 * 
 * 核心数据源：将现代职业趣味映射至对应的唐代古代官职。
 * 支持精确匹配与关键词模糊匹配两种模式。
 */

export const jobDictionary = {
    // ── 科技互联网 ──
    "程序员": [{ title: "将作监丞", rank: "从七品下", desc: "掌邦国营建、土木工匠之政令，犹今之工程营造" }],
    "前端工程师": [{ title: "将作监丞", rank: "从七品下", desc: "掌邦国营建、土木工匠之政令" }],
    "后端工程师": [{ title: "都水监丞", rank: "正七品上", desc: "掌川泽津梁渠堰水利之事务" }],
    "架构师": [{ title: "将作大匠", rank: "从三品", desc: "掌邦国宫室、宗庙及陵寝之营缮" }],
    "产品经理": [
        { title: "中书舍人", rank: "正五品上", desc: "掌侍进奏、参议表章、草拟诏旨" },
        { title: "考功司员外郎", rank: "从六品上", desc: "掌文武百官功过、善恶之考核" }
    ],
    "项目经理": [{ title: "工部侍郎", rank: "正四品下", desc: "掌工程营建及百工技巧之政务" }],
    "测试工程师": [{ title: "考功司员外郎", rank: "从六品上", desc: "掌文武百官功过、善恶之考核" }],
    "运维工程师": [{ title: "太仆寺丞", rank: "从六品上", desc: "掌邦国厩牧、车舆之政令" }],
    "数据分析师": [{ title: "太史令", rank: "从五品上", desc: "掌邦国典籍、天文历法及图书档案" }],
    "UI设计师": [{ title: "少府监丞", rank: "从六品下", desc: "掌百工技巧之政令，供奉御用器物" }],
    "设计师": [{ title: "少府监丞", rank: "从六品下", desc: "掌百工技巧之政令，供奉御用器物" }],

    // ── 管理经营 ──
    "CEO": [{ title: "中书令", rank: "正三品", desc: "掌佐天子执大政，总国之要务" }],
    "总经理": [{ title: "尚书左仆射", rank: "从二品", desc: "掌统理六官、纲纪庶务，为百官之长" }],
    "CTO": [{ title: "工部尚书", rank: "正三品", desc: "掌邦国营缮工程之政令" }],
    "CFO": [{ title: "户部尚书", rank: "正三品", desc: "掌天下土地、人民、赋税之政令" }],
    "财务总监": [{ title: "户部尚书", rank: "正三品", desc: "掌天下土地、邦国、赋税之政令" }],
    "COO": [{ title: "尚书右仆射", rank: "从二品", desc: "掌贰令之职，总领省事" }],

    // ── 人力行政法务 ──
    "HR": [{ title: "吏部侍郎", rank: "正四品上", desc: "掌文选、勋封、考课之政令" }],
    "人事": [{ title: "吏部员外郎", rank: "从六品上", desc: "掌选补流内之官及准拟注拥" }],
    "律师": [{ title: "大理寺丞", rank: "从六品上", desc: "掌折狱详刑之事，鞫审谳断" }],
    "法官": [{ title: "大理寺卿", rank: "从三品", desc: "掌刑狱案件之审理裁决" }],
    "行政": [{ title: "尚书都事", rank: "从七品上", desc: "掌受事发辰、抄目审署之务" }],

    // ── 教育传媒文化 ──
    "老师": [{ title: "国子监博士", rank: "正五品上", desc: "掌教授国学诸生，传承儒学经典" }],
    "教授": [{ title: "国子监祭酒", rank: "从三品", desc: "掌邦国儒学训导之政令" }],
    "记者": [{ title: "左拾遗", rank: "从八品上", desc: "掌供奉讽谏、举荐贤良" }],
    "编辑": [{ title: "著作佐郎", rank: "从六品上", desc: "掌修撰碑志、祝文、祭文" }],
    "作家": [{ title: "翰林学士", rank: "正三品", desc: "掌草拟诏书制册、文翰清要之务" }],
    "主播": [{ title: "通事舍人", rank: "从六品上", desc: "掌朝见引纳、殿庭通事" }],

    // ── 金融商贸 ──
    "会计": [{ title: "度支司主事", rank: "从九品上", desc: "掌邦国财赋岁计、出纳之数" }],
    "银行家": [{ title: "太府寺卿", rank: "从三品", desc: "掌邦国财货府库之政令" }],
    "销售": [{ title: "鸿胪寺丞", rank: "从六品上", desc: "掌宾客朝会、四方使节周旋之事" }],
    "市场营销": [{ title: "鸿胪寺少卿", rank: "从四品上", desc: "掌四方宾客及凶仪之事" }],

    // ── 医疗健康 ──
    "医生": [{ title: "太医署令", rank: "从七品下", desc: "掌诸医疗之法、和剂配药" }],
    "护士": [{ title: "尚药局奉御", rank: "从五品上", desc: "掌供奉御用药剂及候诊侍疾" }],

    // ── 军警安全 ──
    "警察": [{ title: "金吾卫将军", rank: "正三品", desc: "掌宫中及京城日夜巡警之法" }],
    "消防员": [{ title: "武候铺正", rank: "正九品下", desc: "掌巡铺警备、防火禁盗之事" }],
    "军人": [{ title: "左卫大将军", rank: "正三品", desc: "掌宫禁宿卫及督摄队仗" }],

    // ── 物流交通 ──
    "快递员": [{ title: "驿丞", rank: "从九品下", desc: "掌邮驿传符、公文递送之事" }],
    "司机": [{ title: "太仆寺主簿", rank: "从七品上", desc: "掌邦国车舆马政之务" }],

    // ── 其他 ──
    "学生": [{ title: "太学生", rank: "未入流", desc: "入太学研习经史子集，待科举出仕" }],
    "自由职业": [{ title: "处士", rank: "不仕", desc: "有才学而隐逸不仕，高雅清流之士" }],
    "公务员": [{ title: "县主簿", rank: "正九品下", desc: "掌勾检稽失、纪录门下之事" }],
    "外卖员": [{ title: "光禄寺主簿", rank: "从七品上", desc: "掌膳食供奉、酒醴膳羞之事" }],
};

/**
 * 模糊匹配关键词表
 */
export const fuzzyKeywords = [
    { keywords: ["程序", "开发", "代码", "软件", "码农", "IT"], match: "程序员" },
    { keywords: ["产品", "需求", "策划"], match: "产品经理" },
    { keywords: ["设计", "美工", "视觉", "UI", "UX"], match: "设计师" },
    { keywords: ["财务", "会计", "审计", "出纳"], match: "会计" },
    { keywords: ["教师", "讲师", "辅导", "教育"], match: "老师" },
    { keywords: ["销售", "业务", "商务"], match: "销售" },
    { keywords: ["医", "护", "药"], match: "医生" },
    { keywords: ["法", "律"], match: "律师" },
    { keywords: ["记者", "媒体", "新闻", "编辑"], match: "记者" },
    { keywords: ["运营", "市场", "营销", "推广"], match: "市场营销" },
    { keywords: ["人事", "人力", "招聘", "HR"], match: "HR" },
    { keywords: ["军", "兵", "武"], match: "军人" },
    { keywords: ["警", "安保", "保安"], match: "警察" },
    { keywords: ["物流", "快递", "配送"], match: "快递员" },
    { keywords: ["总", "董事", "老板", "创始"], match: "CEO" },
    { keywords: ["写", "文", "作家", "小说"], match: "作家" },
    { keywords: ["学生", "读书", "在校", "研究生", "本科"], match: "学生" },
];

/**
 * 默认回退官职 (Fallback)
 */
export const fallbackJob = {
    title: "散骑常侍",
    rank: "从三品",
    desc: "入则规谏过失，备顾问应对，出则骑马散从，拾遗补缺"
};

/**
 * 为数组结果执行随机抽取 (黑盒化)
 * @param {Array} results 
 * @returns {Object}
 */
function randomPick(results) {
    if (!results || results.length === 0) return fallbackJob;
    const index = Math.floor(Math.random() * results.length);
    return results[index];
}

/**
 * 匹配现代职业到古代官职
 */
export function matchJob(input) {
    if (!input || !input.trim()) return fallbackJob;

    const normalized = input.trim();

    // 1. 精确匹配
    if (jobDictionary[normalized]) {
        return randomPick(jobDictionary[normalized]);
    }

    // 2. 模糊关键词匹配
    const lowerInput = normalized.toLowerCase();
    for (const entry of fuzzyKeywords) {
        if (entry.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))) {
            return randomPick(jobDictionary[entry.match]);
        }
    }

    // 3. 回退 (逻辑外移由 Meilisearch/Directus 承接)
    return null; 
}
