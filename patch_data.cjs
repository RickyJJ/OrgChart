const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/dynastyData.js');
let content = fs.readFileSync(filePath, 'utf8');

const ids = ['sixun_si', 'zhujue_si', 'duzhi_si', 'jinbu_si', 'cangbu_si', 'cibu_si', 'zhuke_si', 'shanbu_si', 'zhifang_si', 'jiabu_si', 'kubu_si', 'duguan_si', 'bibu_si', 'simen_si', 'tuntian_si', 'yubu_si', 'shuibu_si', 'guozijian'];

const replacements = {
  'sixun_si': `,
                                            "children": [
                                                {
                                                    "id": "sixun_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "司勋司的主官，掌管天下文武官员的勋爵与功赏记录。"
                                                },
                                                {
                                                    "id": "sixun_yuanwailang",
                                                    "title": "员外郎",
                                                    "type": "admin",
                                                    "level": "从六品上",
                                                    "salary": {
                                                        "lu_mi": "90",
                                                        "yue_feng": "2000",
                                                        "shi_liao": "400",
                                                        "za_yong": "400",
                                                        "zhi_tian": "400"
                                                    },
                                                    "description": "司勋司副长官。晚唐大诗人杜牧曾任此职，留下了千古传诵的诗篇。",
                                                    "figures": ["杜牧"],
                                                    "allusions": [
                                                        {
                                                            "title": "杜司勋",
                                                            "text": "杜牧在晚唐时曾任司勋员外郎，世人常以其官名称呼他为‘杜司勋’。"
                                                        }
                                                    ],
                                                    "poetry": [
                                                        {
                                                            "author": "杜牧",
                                                            "poem": "十年一觉扬州梦，赢得青楼薄幸名。"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }`,
  'zhujue_si': `,
                                            "children": [
                                                {
                                                    "id": "zhujue_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "主爵司的主官，掌管天下贵族爵位的承袭与封号事务。"
                                                }
                                            ]
                                        }`,
  'duzhi_si': `,
                                            "children": [
                                                {
                                                    "id": "duzhi_langzhong",
                                                    "title": "郎中",
                                                    "type": "finance",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "度支司主官，掌管国家整体财政预算与各项开支统筹。"
                                                }
                                            ]
                                        }`,
  'jinbu_si': `,
                                            "children": [
                                                {
                                                    "id": "jinbu_langzhong",
                                                    "title": "郎中",
                                                    "type": "finance",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "金部司主官，掌管天下钱币铸造、市场税收与标准度量衡。"
                                                }
                                            ]
                                        }`,
  'cangbu_si': `,
                                            "children": [
                                                {
                                                    "id": "cangbu_langzhong",
                                                    "title": "郎中",
                                                    "type": "finance",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "仓部司主官，掌管天下太仓米粮与赈济调拨事务。"
                                                }
                                            ]
                                        }`,
  'cibu_si': `,
                                            "children": [
                                                {
                                                    "id": "cibu_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "祠部司的主官，掌管国家最高级别的宗庙祭祀与佛道度牒管理。"
                                                }
                                            ]
                                        }`,
  'zhuke_si': `,
                                            "children": [
                                                {
                                                    "id": "zhuke_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "主客司的主官，专门负责大唐外交，接待四方藩国与使节朝贡。"
                                                },
                                                {
                                                    "id": "zhuke_yuanwailang",
                                                    "title": "员外郎",
                                                    "type": "admin",
                                                    "level": "从六品上",
                                                    "salary": {
                                                        "lu_mi": "90",
                                                        "yue_feng": "2000",
                                                        "shi_liao": "400",
                                                        "za_yong": "400",
                                                        "zhi_tian": "400"
                                                    },
                                                    "description": "主客司副长官。盛唐时期，文坛泰斗贺知章曾任此职，广交天下文士与各国使节。",
                                                    "figures": ["贺知章"]
                                                }
                                            ]
                                        }`,
  'shanbu_si': `,
                                            "children": [
                                                {
                                                    "id": "shanbu_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "膳部司的主官，掌管宫廷祭祀的牺牲、百官酒食与国宴餐饮。"
                                                }
                                            ]
                                        }`,
  'zhifang_si': `,
                                            "children": [
                                                {
                                                    "id": "zhifang_langzhong",
                                                    "title": "郎中",
                                                    "type": "military",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "职方司主官，掌管全国版图、城防险阻与边疆军事情报测绘。"
                                                }
                                            ]
                                        }`,
  'jiabu_si': `,
                                            "children": [
                                                {
                                                    "id": "jiabu_langzhong",
                                                    "title": "郎中",
                                                    "type": "military",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "驾部司主官，掌管大唐帝国极其庞大的驿站系统与军马官车。"
                                                }
                                            ]
                                        }`,
  'kubu_si': `,
                                            "children": [
                                                {
                                                    "id": "kubu_langzhong",
                                                    "title": "郎中",
                                                    "type": "military",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "库部司主官，掌管全国军队武器、甲胄与仪仗的制造与库存。",
                                                    "figures": ["王维"],
                                                    "allusions": [
                                                        {
                                                            "title": "诗佛入库",
                                                            "text": "大诗人王维在安史之乱前，曾担任过库部郎中，这段时期也是他在官场上较为平稳的阶段。"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }`,
  'duguan_si': `,
                                            "children": [
                                                {
                                                    "id": "duguan_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "都官司主官，掌管天下官办奴婢的籍帐簿册。"
                                                }
                                            ]
                                        }`,
  'bibu_si': `,
                                            "children": [
                                                {
                                                    "id": "bibu_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "比部司主官，国家最高审计长官。掌管对全国朝廷、军队及各州县经费开支的严格审计。"
                                                },
                                                {
                                                    "id": "bibu_yuanwailang",
                                                    "title": "员外郎",
                                                    "type": "admin",
                                                    "level": "从六品上",
                                                    "salary": {
                                                        "lu_mi": "90",
                                                        "yue_feng": "2000",
                                                        "shi_liao": "400",
                                                        "za_yong": "400",
                                                        "zhi_tian": "400"
                                                    },
                                                    "description": "比部司副长官。唐代著名诗人韦应物曾任此职，为官清廉，世称‘韦比部’。",
                                                    "figures": ["韦应物"],
                                                    "allusions": [
                                                        {
                                                            "title": "韦比部",
                                                            "text": "韦应物在德宗年间担任比部员外郎，因其诗风恬淡高远、为官清正而被世人传诵。"
                                                        }
                                                    ],
                                                    "poetry": [
                                                        {
                                                            "author": "韦应物",
                                                            "poem": "春潮带雨晚来急，野渡无人舟自横。"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }`,
  'simen_si': `,
                                            "children": [
                                                {
                                                    "id": "simen_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "司门司主官，掌管国家重镇关隘的通行证（过所）与门禁锁钥管理。"
                                                }
                                            ]
                                        }`,
  'tuntian_si': `,
                                            "children": [
                                                {
                                                    "id": "tuntian_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "屯田司主官，掌管天下屯田、营田的政令与百官职分田的分配。"
                                                }
                                            ]
                                        }`,
  'yubu_si': `,
                                            "children": [
                                                {
                                                    "id": "yubu_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "虞部司主官，国家山林苑囿的保护局长，掌管京城绿化与皇家打猎的场地维护。"
                                                }
                                            ]
                                        }`,
  'shuibu_si': `,
                                            "children": [
                                                {
                                                    "id": "shuibu_langzhong",
                                                    "title": "郎中",
                                                    "type": "admin",
                                                    "level": "从五品上",
                                                    "salary": {
                                                        "lu_mi": "160",
                                                        "yue_feng": "3000",
                                                        "shi_liao": "600",
                                                        "za_yong": "600",
                                                        "zhi_tian": "600"
                                                    },
                                                    "description": "水部司主官，掌管天下水利、桥梁、津渡的工程修缮与通航。"
                                                },
                                                {
                                                    "id": "shuibu_yuanwailang",
                                                    "title": "员外郎",
                                                    "type": "admin",
                                                    "level": "从六品上",
                                                    "salary": {
                                                        "lu_mi": "90",
                                                        "yue_feng": "2000",
                                                        "shi_liao": "400",
                                                        "za_yong": "400",
                                                        "zhi_tian": "400"
                                                    },
                                                    "description": "水部司副长官。中唐著名诗人张籍曾长期担任此职，世称‘张水部’。",
                                                    "figures": ["张籍"],
                                                    "allusions": [
                                                        {
                                                            "title": "张水部与节妇吟",
                                                            "text": "张籍任水部员外郎时，节镇军阀李师道重金拉拢他。张籍写下《节妇吟》委婉拒绝了诱惑，成就一段文坛佳话。"
                                                        }
                                                    ],
                                                    "poetry": [
                                                        {
                                                            "author": "张籍",
                                                            "poem": "还君明珠双泪垂，恨不相逢未嫁时。"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }`,
  'guozijian': `,
                            "children": [
                                {
                                    "id": "guozi_jijiu",
                                    "title": "国子祭酒",
                                    "type": "admin",
                                    "level": "从三品",
                                    "salary": {
                                        "lu_mi": "360",
                                        "yue_feng": "4500",
                                        "shi_liao": "900",
                                        "za_yong": "800",
                                        "zhi_tian": "800"
                                    },
                                    "description": "国子监最高长官。大唐国家最高学府的‘校长’，主持国家学术标准的订立。",
                                    "figures": ["孔颖达", "韩愈"],
                                    "allusions": [
                                        {
                                            "title": "桃李满天下",
                                            "text": "国子祭酒执掌最高学府，不仅有教学之责，更是天下学子尊崇的宗师。"
                                        }
                                    ]
                                },
                                {
                                    "id": "guozi_siye",
                                    "title": "国子司业",
                                    "type": "admin",
                                    "level": "从四品下",
                                    "salary": {
                                        "lu_mi": "240",
                                        "yue_feng": "3500",
                                        "shi_liao": "700",
                                        "za_yong": "700",
                                        "zhi_tian": "700"
                                    },
                                    "description": "国子监的副长官（常设两人），协助祭酒管理学政，亲自教导生员经义。",
                                    "figures": ["阳城"]
                                }
                            ]
                        }`
};

for (const id of ids) {
  // Find the exact block
  // We look for "id": "id_name"
  const regexStr = '"id"\\s*:\\s*"' + id + '"[\\s\\S]*?\\}\\s*\\n';
  const re = new RegExp(regexStr, 'g');
  
  content = content.replace(re, (match) => {
    // We only replace the very last closing brace before the newline
    const lastBraceIdx = match.lastIndexOf('}');
    if (lastBraceIdx !== -1) {
      return match.substring(0, lastBraceIdx) + replacements[id] + match.substring(lastBraceIdx + 1);
    }
    return match;
  });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update successful!');
