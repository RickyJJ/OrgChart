/**
 * 静态官制数据 (Static Dynasty Data)
 * 
 * 数据来源：原 Directus/PostgreSQL 数据库全量导出 (backend/temp/full-data.json)
 * 砍掉后端依赖后，由前端直接硬编码加载。
 */

export const dynastyData = [
    {
        "id": "tang",
        "name": "唐朝",
        "structure": {
            "id": "tang_emperor",
            "title": "皇帝",
            "englishTitle": "The Emperor",
            "level": "最高统治者",
            "bgImage": "/assets/ui/emperor-bg.png",
            "hideText": true,
            "hideBorder": true,
            "description": "封建社会的最高统治者，掌握全国军政大权。",
            "children": [
                {
                    "id": "tang_central_government",
                    "title": "大唐中央政权中枢",
                    "level": "统辖机构",
                    "salary": {
                        "remark": "统辖机构无定禄，依具体职事官品阶发放"
                    },
                    "description": "唐代国家最高权力与行政运行的核心网络，承袭隋代五省六曹制并加以完善，确立了三省六部制、一台九寺五监的宏大格局，不仅实现了决策、审议与执行的三权分立与制衡，更是中国封建社会文官体制的巅峰代表。",
                    "children": [
                        {
                            "id": "zhongshu_sheng",
                            "title": "中书省",
                            "type": "admin",
                            "level": "正三品机构",
                            "salary": {
                                "remark": "机构无定禄，依具体职事官品阶发放"
                            },
                            "description": "大唐帝国的最高决策中心，相当于现代的中央政策研究室与最高秘书处。主要负责体察皇帝意图，草拟军国大事的诏敕与国家政令，是国家最高权力的发源地与政治中枢。",
                            "allusions": [
                                {
                                    "title": "内史避讳",
                                    "text": "隋代原称内史省，唐初建立后，为避唐高祖李渊之父李昞及太宗李世民的字讳，曾多次更名，最终定格为中书省，彰显其作为政权核心的敏感性。"
                                }
                            ],
                            "children": [
                                {
                                    "id": "zhongshu_ling",
                                    "title": "中书令",
                                    "type": "admin",
                                    "level": "正三品",
                                    "salary": {
                                        "lu_mi": "400",
                                        "yue_feng": "5100",
                                        "shi_liao": "1100",
                                        "za_yong": "900",
                                        "zhi_tian": "900"
                                    },
                                    "description": "中书省的最高长官，大唐真宰相。执掌国家机要，每日伴随君王左右，定旨出命，权势熏天，非心腹重臣不能担任。",
                                    "figures": [
                                        "房玄龄",
                                        "张九龄",
                                        "长孙无忌",
                                        "褚遂良"
                                    ]
                                },
                                {
                                    "id": "zhongshu_she_ren",
                                    "title": "中书舍人",
                                    "type": "admin",
                                    "level": "正五品上",
                                    "salary": {
                                        "lu_mi": "200",
                                        "yue_feng": "3000",
                                        "shi_liao": "600",
                                        "za_yong": "600",
                                        "zhi_tian": "600"
                                    },
                                    "description": "中书省的核心骨干，大唐帝国的‘首席御用笔杆子’。专门负责撰写皇帝的诏书，要求必须具备极为深厚的文学功底与敏锐的政治嗅觉。",
                                    "figures": [
                                        "贾至"
                                    ]
                                },
                                {
                                    "id": "you_buque",
                                    "title": "右补阙",
                                    "type": "admin",
                                    "level": "从七品上",
                                    "salary": {
                                        "lu_mi": "70",
                                        "yue_feng": "1750",
                                        "shi_liao": "350",
                                        "za_yong": "350",
                                        "zhi_tian": "350"
                                    },
                                    "description": "隶属中书省的谏官。品阶虽低，但常伴皇帝左右，负责对皇帝的过失进行规劝，对朝政阙失进行修补，要求任职者具有极高的文学素养与政治胆识。",
                                    "figures": [
                                        "岑参",
                                        "张说"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "阳春和曲",
                                            "text": "岑参担任右补阙时，其上司中书舍人贾至写诗首唱，岑参以一首工稳精到的和诗作答，既颂扬了长官，又展现了自身绝顶才华，成就唐诗佳话。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "岑参",
                                            "poem": "独有凤凰池上客，阳春一曲和皆难。（赏析：以‘凤凰池’代指中书省，极度推崇了中书省官员的清贵与超凡脱俗，透露出在权力核心为官的自豪。）"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "menxia_sheng",
                            "title": "门下省",
                            "type": "admin",
                            "level": "正三品机构",
                            "salary": {
                                "remark": "机构无定禄，依具体职事官品阶发放"
                            },
                            "description": "大唐帝国的最高审议机构，相当于现代的违宪审查委员会。负责对中书省草拟的诏令进行二次审核，若发现不妥或违背法制，拥有直接驳回皇帝诏书的‘封驳’大权。",
                            "allusions": [
                                {
                                    "title": "门下封驳",
                                    "text": "门下省的存在有效制约了皇权的滥用与中书省的专断。魏征任侍中时，多次驳回太宗不合常理的诏令，成就了贞观之治的清明政治。"
                                }
                            ],
                            "children": [
                                {
                                    "id": "shizhong",
                                    "title": "侍中",
                                    "type": "admin",
                                    "level": "正三品",
                                    "salary": {
                                        "lu_mi": "400",
                                        "yue_feng": "5100",
                                        "shi_liao": "1100",
                                        "za_yong": "900",
                                        "zhi_tian": "900"
                                    },
                                    "description": "门下省的长官，大唐宰相之一。掌握审核驳正大权，不仅是朝廷法度的守护者，更是制衡君权与相权的关键人物。",
                                    "figures": [
                                        "魏征",
                                        "王珪"
                                    ]
                                },
                                {
                                    "id": "geishi_zhong",
                                    "title": "给事中",
                                    "type": "admin",
                                    "level": "正五品上",
                                    "salary": {
                                        "lu_mi": "200",
                                        "yue_feng": "3000",
                                        "shi_liao": "600",
                                        "za_yong": "600",
                                        "zhi_tian": "600"
                                    },
                                    "description": "门下省的实权审核官。中书省下发的诏敕和百官的奏章，均需经过给事中的严格审核。若认为不便下达，可以涂窜奏章甚至直接驳回。",
                                    "figures": [
                                        "高适"
                                    ]
                                },
                                {
                                    "id": "zuo_shiyi",
                                    "title": "左拾遗",
                                    "type": "admin",
                                    "level": "从八品上",
                                    "salary": {
                                        "lu_mi": "50",
                                        "yue_feng": "1300",
                                        "shi_liao": "300",
                                        "za_yong": "250",
                                        "zhi_tian": "250"
                                    },
                                    "description": "隶属门下省的谏官。虽然位于官僚体系的底端，但享有‘上封事’的直言进谏特权，负责捡拾朝政遗漏，是士大夫践行‘文死谏’理想的阵地。",
                                    "figures": [
                                        "杜甫",
                                        "陈子昂"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "皂囊封板",
                                            "text": "拾遗与补阙掌供奉讽谏，大则在朝堂之上廷诤，小则用皂色布囊封装备忘录秘密上奏（封事），体现了唐代开明的谏诤风气。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "杜甫",
                                            "poem": "明朝有封事，数问夜如何？（赏析：诗圣杜甫任左拾遗时，为了明早向皇帝上呈谏言彻夜难眠，频繁询问夜漏几何，生动刻画了谏官忧国忧民的忠勤之态。）"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "shangshu_sheng",
                            "title": "尚书省",
                            "type": "admin",
                            "level": "正二品机构",
                            "salary": {
                                "remark": "机构无定禄，依具体职事官品阶发放"
                            },
                            "description": "大唐帝国的最高行政执行总枢纽，下辖六部二十四司。犹如庞大的政务院，负责将中书、门下两省的宏观决策转化为具体的条文政令，向全国州县派发执行。",
                            "allusions": [
                                {
                                    "title": "尚书令虚设",
                                    "text": "因唐太宗李世民在秦王时期曾担任尚书令一职，其登基后，臣子为了避讳皆不敢出任此最高职务，导致大唐尚书令一职长期空缺，实际由左右仆射代行长官之职。"
                                }
                            ],
                            "children": [
                                {
                                    "id": "shangshu_puye",
                                    "title": "尚书左右仆射",
                                    "type": "admin",
                                    "level": "从二品",
                                    "salary": {
                                        "lu_mi": "460",
                                        "yue_feng": "6500",
                                        "shi_liao": "1500",
                                        "za_yong": "1000",
                                        "zhi_tian": "1000"
                                    },
                                    "description": "尚书省的实际最高长官。统辖六部，调度全国行政网络，常常加‘同中书门下平章事’头衔，成为大唐的实权宰相。",
                                    "figures": [
                                        "房玄龄",
                                        "李靖",
                                        "封德彝"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "虚悬令位",
                                            "text": "因唐太宗李世民在登基前曾任尚书令，此后臣子皆不敢居其位，导致尚书令长期空缺。左右仆射便顺理成章地成为尚书省的实际最高长官，掌管大唐帝国庞大的行政机器。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "王维",
                                            "poem": "九天阊阖开宫殿，万国衣冠拜冕旒。（赏析：描绘了早朝时大明宫的威严景象，正是左右仆射这等宰相重臣统领百官朝见的真实写照。）"
                                        }
                                    ]
                                },
                                {
                                    "id": "libu_personnel",
                                    "title": "吏部",
                                    "type": "admin",
                                    "level": "正三品机构",
                                    "salary": {
                                        "remark": "机构无定禄，依具体职事官品阶发放"
                                    },
                                    "description": "六部之首，大唐帝国的‘国家人事部’。掌管天下文官的任免、考课、升降、勋封与调动，手中掌握着天下读书人的仕途命脉，权势极大。",
                                    "allusions": [
                                        {
                                            "title": "吏部铨选",
                                            "text": "唐代科举及第后并不能直接做官，还必须经过吏部极其严苛的‘身、言、书、判’四项铨选考核，过关者方能授官，无数才子因此白首穷经。"
                                        }
                                    ],
                                    "children": [
                                        {
                                            "id": "libu_si",
                                            "title": "吏部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "吏部第一司。专门负责全国文职官员的选拔与任命，掌管官员的履历名册，是官僚阶层流动的总闸门。",
                                            "children": [
                                                {
                                                    "id": "libu_langzhong",
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
                                                    "description": "吏部司的最高长官（正主官），古代部门司长。手握文官定级任命大权，是无数士子科举后最想攀附的实权人物。",
                                                    "figures": [
                                                        "裴度",
                                                        "韩愈"
                                                    ]
                                                },
                                                {
                                                    "id": "libu_yuanwailang",
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
                                                    "description": "吏部司的副主官。原本指在正员之外增设的郎官，随着行政繁复，逐渐成为各司固定的二把手。"
                                                },
                                                {
                                                    "id": "libu_zhushi",
                                                    "title": "主事",
                                                    "type": "admin",
                                                    "level": "从九品上",
                                                    "salary": {
                                                        "lu_mi": "30",
                                                        "yue_feng": "1050",
                                                        "shi_liao": "250",
                                                        "za_yong": "200",
                                                        "zhi_tian": "200"
                                                    },
                                                    "description": "吏部司内的底层正规行政官，流内九品官的起点。主要负责起草铨选文案、核对履历等具体繁琐事务。"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "kaogong_si",
                                            "title": "考功司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "古代的‘国家级KPI考核办’。负责对全国文武官员进行年度绩效考核与品行评定，考核结果直接决定官员的升迁与罢黜。",
                                            "children": [
                                                {
                                                    "id": "kaogong_langzhong",
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
                                                    "description": "考功司长官。主理文武百官的政绩考核，初唐时更兼管科举考试，权力极大。"
                                                },
                                                {
                                                    "id": "kaogong_yuanwailang",
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
                                                    "description": "考功司副主官。辅佐郎中审定天下官员的‘善恶之状’。"
                                                },
                                                {
                                                    "id": "kaogong_zhushi",
                                                    "title": "主事",
                                                    "type": "admin",
                                                    "level": "从九品上",
                                                    "salary": {
                                                        "lu_mi": "30",
                                                        "yue_feng": "1050",
                                                        "shi_liao": "250",
                                                        "za_yong": "200",
                                                        "zhi_tian": "200"
                                                    },
                                                    "description": "负责汇总、抄录和归档各州县上报的官员政绩材料的底层官员。"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "sixun_si",
                                            "title": "司勋司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "主管国家勋官制度的部门。负责记录武将战功与文臣功劳，并据此发放代表荣誉与待遇的十二转勋位。"
                                        },
                                        {
                                            "id": "zhujue_si",
                                            "title": "主爵司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "掌管天下贵族与功臣爵位的承袭、褫夺与封赠。大唐开国县男直至亲王的爵位档案，皆由该司严密管控。"
                                        }
                                    ]
                                },
                                {
                                    "id": "hubu",
                                    "title": "户部",
                                    "type": "finance",
                                    "level": "正三品机构",
                                    "salary": {
                                        "remark": "机构无定禄，依具体职事官品阶发放"
                                    },
                                    "description": "大唐帝国的‘财政部兼民政部’。掌管天下土地、疆界、户籍编造、赋税征收与国家财政收支，是大唐经济运行的钱袋子。",
                                    "allusions": [
                                        {
                                            "title": "避讳改名",
                                            "text": "户部在隋代及唐初原称‘民部’，后因避唐太宗李世民之‘民’字讳，遂更名为户部，并沿用至清末。"
                                        }
                                    ],
                                    "children": [
                                        {
                                            "id": "hubu_si",
                                            "title": "户部司",
                                            "type": "finance",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "户部的核心枢纽。主管天下户籍的登记更迭、人口普查以及田地的划分，是国家推行均田制与租庸调法的底层数据中心。",
                                            "children": [
                                                {
                                                    "id": "hubu_langzhong",
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
                                                    "description": "户部司最高长官。掌控天下户口簿籍与田地划拨的总枢纽，是维持国家赋税基石的核心人物。",
                                                    "figures": [
                                                        "刘晏"
                                                    ]
                                                },
                                                {
                                                    "id": "hubu_yuanwailang",
                                                    "title": "员外郎",
                                                    "type": "finance",
                                                    "level": "从六品上",
                                                    "salary": {
                                                        "lu_mi": "90",
                                                        "yue_feng": "2000",
                                                        "shi_liao": "400",
                                                        "za_yong": "400",
                                                        "zhi_tian": "400"
                                                    },
                                                    "description": "户部司副主官，协助郎中统筹庞杂的人口数据与赋税征收工作。"
                                                },
                                                {
                                                    "id": "hubu_zhushi",
                                                    "title": "主事",
                                                    "type": "finance",
                                                    "level": "从九品上",
                                                    "salary": {
                                                        "lu_mi": "30",
                                                        "yue_feng": "1050",
                                                        "shi_liao": "250",
                                                        "za_yong": "200",
                                                        "zhi_tian": "200"
                                                    },
                                                    "description": "户部最底层的流内官，也是极为辛劳的职位，负责审核各州县上报的户籍卷宗和地契数据。"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "duzhi_si",
                                            "title": "度支司",
                                            "type": "finance",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "大唐的‘国家预算局’。负责统筹计算国家全年的财政总收入，并规划给军政百官的俸禄及各项国家建设支出的预算分配。"
                                        },
                                        {
                                            "id": "jinbu_si",
                                            "title": "金部司",
                                            "type": "finance",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "古代的国家金库与度量衡管理局。掌管天下市肆的商业税收、货币铸造发行，以及国家标准度量衡的校准。"
                                        },
                                        {
                                            "id": "cangbu_si",
                                            "title": "仓部司",
                                            "type": "finance",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家战略物资储备局。掌管全国官办粮仓、军粮调拨以及灾荒年份的开仓赈济事务，关乎帝国的粮食安全底线。"
                                        }
                                    ]
                                },
                                {
                                    "id": "libu_rites",
                                    "title": "礼部",
                                    "type": "admin",
                                    "level": "正三品机构",
                                    "salary": {
                                        "remark": "机构无定禄，依具体职事官品阶发放"
                                    },
                                    "description": "大唐帝国的‘外交、文化与教育部’。掌管国家吉、凶、军、宾、嘉五礼，以及祭祀神明、科举考试与接待外国使节的事务。",
                                    "allusions": [
                                        {
                                            "title": "雁塔题名",
                                            "text": "大唐读书人最向往的荣耀。科举发榜后，新科进士们会在礼部组织的曲江宴后，前往慈恩寺大雁塔刻下自己的名字，标志着正式踏入大唐统治阶层。"
                                        }
                                    ],
                                    "children": [
                                        {
                                            "id": "libu_si_rites",
                                            "title": "礼部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "掌管国家各类重大典礼的仪注排演，以及全国学校教育的管理和最受读书人瞩目的科举考试（春闱）的组织工作。",
                                            "children": [
                                                {
                                                    "id": "libu_rites_langzhong",
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
                                                    "description": "礼部司的主官。负责科举考试的具体统筹，以及国家级大典的礼仪排演，是文人学子眼中的‘宗师’。",
                                                    "figures": [
                                                        "柳宗元"
                                                    ]
                                                },
                                                {
                                                    "id": "libu_rites_yuanwailang",
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
                                                    "description": "礼部司的副官。协助郎中处理国家文教、科举发榜等事务。很多唐代著名文人都曾担任过员外郎一职。"
                                                },
                                                {
                                                    "id": "libu_rites_zhushi",
                                                    "title": "主事",
                                                    "type": "admin",
                                                    "level": "从九品上",
                                                    "salary": {
                                                        "lu_mi": "30",
                                                        "yue_feng": "1050",
                                                        "shi_liao": "250",
                                                        "za_yong": "200",
                                                        "zhi_tian": "200"
                                                    },
                                                    "description": "礼部司内处理文案、档案、仪仗器物清点等底层行政操作的实务官员。"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "cibu_si",
                                            "title": "祠部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家宗教与祭祀管理局。负责皇家宗庙祭祀、名山大川祈福，以及对天下佛教、道教僧尼道士的度牒管理与约束。"
                                        },
                                        {
                                            "id": "zhuke_si",
                                            "title": "主客司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "大唐专职外交接待处。负责迎接、安置前来朝贡的藩属国使臣与外国使节，安排觐见礼仪，彰显万邦来朝的大国气象。"
                                        },
                                        {
                                            "id": "shanbu_si",
                                            "title": "膳部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家最高后勤餐饮部。掌管皇家祭祀用到的三牲祭品、皇帝赏赐给百官的酒食，以及重要国家宴会（如曲江宴）的统筹布置。"
                                        }
                                    ]
                                },
                                {
                                    "id": "bingbu",
                                    "title": "兵部",
                                    "type": "military",
                                    "level": "正三品机构",
                                    "salary": {
                                        "remark": "机构无定禄，依具体职事官品阶发放"
                                    },
                                    "description": "大唐帝国的‘国防部’。掌管天下武将的选用、兵籍管理、军械制造与军令传达。但为了防范武将专权，兵部只掌军政，不直接掌管军队的指挥权。",
                                    "allusions": [
                                        {
                                            "title": "合符发兵",
                                            "text": "大唐调遣军队拥有极其严格的流程。必须由皇帝下发‘铜鱼符’的右半边，与统兵将领手中的左半边勘合无误后，再配合兵部的军令，方能调动一兵一卒。"
                                        }
                                    ],
                                    "children": [
                                        {
                                            "id": "bingbu_si",
                                            "title": "兵部司",
                                            "type": "military",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "主管全国武官的考核选拔、府兵的兵籍名册管理，以及调动军队时所使用的鱼符与勘合的发放。",
                                            "children": [
                                                {
                                                    "id": "bingbu_langzhong",
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
                                                    "description": "兵部司的主官。掌握天下武将升迁调度与府兵名册的实权文官，体现了大唐‘以文制武’的治理逻辑。",
                                                    "figures": [
                                                        "李勣",
                                                        "李靖"
                                                    ]
                                                },
                                                {
                                                    "id": "bingbu_yuanwailang",
                                                    "title": "员外郎",
                                                    "type": "military",
                                                    "level": "从六品上",
                                                    "salary": {
                                                        "lu_mi": "90",
                                                        "yue_feng": "2000",
                                                        "shi_liao": "400",
                                                        "za_yong": "400",
                                                        "zhi_tian": "400"
                                                    },
                                                    "description": "兵部司的副手。协助兵部尚书及郎中下达军令、勘发兵符。"
                                                },
                                                {
                                                    "id": "bingbu_zhushi",
                                                    "title": "主事",
                                                    "type": "military",
                                                    "level": "从九品上",
                                                    "salary": {
                                                        "lu_mi": "30",
                                                        "yue_feng": "1050",
                                                        "shi_liao": "250",
                                                        "za_yong": "200",
                                                        "zhi_tian": "200"
                                                    },
                                                    "description": "兵部司内负责誊抄军令、整理武将战功与军籍档案的文书官员。"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "zhifang_si",
                                            "title": "职方司",
                                            "type": "military",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "古代的国家军事测绘与军事情报局。掌管天下各州县的地图、边防重镇的险要关隘地理信息，以及边疆番邦的动态防备。"
                                        },
                                        {
                                            "id": "jiabu_si",
                                            "title": "驾部司",
                                            "type": "military",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家交通与军马管理局。统筹全国庞大的驿站网络运行，掌管驿马、官车的调配，保障帝国军令与政令传递的畅通无阻。"
                                        },
                                        {
                                            "id": "kubu_si",
                                            "title": "库部司",
                                            "type": "military",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家军火库管理局。主管全国军队所需的甲胄、弓弩、刀枪等冷兵器的督造、入库检验与战时配发。"
                                        }
                                    ]
                                },
                                {
                                    "id": "xingbu",
                                    "title": "刑部",
                                    "type": "admin",
                                    "level": "正三品机构",
                                    "salary": {
                                        "remark": "机构无定禄，依具体职事官品阶发放"
                                    },
                                    "description": "大唐帝国的‘最高司法行政部’。主管全国律令的制定解释、刑名审核及刑狱政令，与大理寺、御史台共称为‘三法司’，负责国家重大死刑案件的最终复核定罪。",
                                    "allusions": [
                                        {
                                            "title": "三司推事",
                                            "text": "大唐遇到极其重大的疑难案件时，会由刑部、大理寺与御史台三法司的长官共同审理，称为‘三司推事’，以最大限度保证司法查明的公正性。"
                                        }
                                    ],
                                    "children": [
                                        {
                                            "id": "xingbu_si",
                                            "title": "刑部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "刑部核心枢纽，掌管国家法律与刑狱复核。",
                                            "children": [
                                                {
                                                    "id": "xingbu_langzhong",
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
                                                    "description": "刑部司主官，国家高级司法审核官。大唐重刑死刑均需其参与复核定谳。",
                                                    "figures": [
                                                        "徐有功"
                                                    ]
                                                },
                                                {
                                                    "id": "xingbu_yuanwailang",
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
                                                    "description": "刑部司副官，辅佐郎中审理复核各地报送的重案、要案卷宗。"
                                                },
                                                {
                                                    "id": "xingbu_zhushi",
                                                    "title": "主事",
                                                    "type": "admin",
                                                    "level": "从九品上",
                                                    "salary": {
                                                        "lu_mi": "30",
                                                        "yue_feng": "1050",
                                                        "shi_liao": "250",
                                                        "za_yong": "200",
                                                        "zhi_tian": "200"
                                                    },
                                                    "description": "刑部司内的司法文案，负责刑案宗卷的抄录与流转归档。"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "duguan_si",
                                            "title": "都官司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "主要掌管国家官奴婢的籍帐与配没、释放事务。"
                                        },
                                        {
                                            "id": "bibu_si",
                                            "title": "比部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "大唐帝国的‘国家审计署’。负责审查中央与地方所有库藏、钱粮支出的账目，防止贪墨。"
                                        },
                                        {
                                            "id": "simen_si",
                                            "title": "司门司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家边关出入与交通安全管理局。掌管天下关津、桥梁的通行关防与门禁。"
                                        }
                                    ]
                                },
                                {
                                    "id": "gongbu",
                                    "title": "工部",
                                    "type": "admin",
                                    "level": "正三品机构",
                                    "salary": {
                                        "remark": "机构无定禄，依具体职事官品阶发放"
                                    },
                                    "description": "大唐帝国的‘国家建设部’。掌管天下山泽资源的开发、屯田的管理、道路水利建设以及皇家与政府各类基础设施的营造工程。",
                                    "allusions": [
                                        {
                                            "title": "位居六部之极",
                                            "text": "在隋唐时期，相较于掌控人事与财权的热门衙门，主管营造建设与百工技艺的工部往往被视为清苦之地，但却是维系整个帝国运转最不可或缺的基础。"
                                        }
                                    ],
                                    "children": [
                                        {
                                            "id": "gongbu_si",
                                            "title": "工部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "主理城池、宫殿建设及百工技艺。",
                                            "children": [
                                                {
                                                    "id": "gongbu_langzhong",
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
                                                    "description": "工部司主官，统筹国家重大工程的营建。",
                                                    "figures": [
                                                        "阎立本",
                                                        "段纶"
                                                    ]
                                                },
                                                {
                                                    "id": "gongbu_yuanwailang",
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
                                                    "description": "工部司副官。诗圣杜甫曾任检校工部员外郎，故世称‘杜工部’。"
                                                },
                                                {
                                                    "id": "gongbu_zhushi",
                                                    "title": "主事",
                                                    "type": "admin",
                                                    "level": "从九品上",
                                                    "salary": {
                                                        "lu_mi": "30",
                                                        "yue_feng": "1050",
                                                        "shi_liao": "250",
                                                        "za_yong": "200",
                                                        "zhi_tian": "200"
                                                    },
                                                    "description": "工部内的底层工程行政人员，负责具体图纸、匠人名册的整理。"
                                                }
                                            ]
                                        },
                                        {
                                            "id": "tuntian_si",
                                            "title": "屯田司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "负责管理天下军屯与营田，为国家提供粮食储备与军需后勤。"
                                        },
                                        {
                                            "id": "yubu_si",
                                            "title": "虞部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家自然资源保护局。掌管天下山泽、鸟兽、草木的保护及打猎的律令。"
                                        },
                                        {
                                            "id": "shuibu_si",
                                            "title": "水部司",
                                            "type": "admin",
                                            "level": "从五品上机构",
                                            "salary": {
                                                "remark": "机构无定禄"
                                            },
                                            "description": "国家水利交通局。掌管天下川泽、漕运水道及桥梁的维护。"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "yushitai",
                            "title": "御史台",
                            "type": "admin",
                            "level": "从三品机构",
                            "salary": {
                                "remark": "机构无定禄，依具体职事官品阶发放"
                            },
                            "description": "大唐帝国的最高监察机关，俗称‘宪台’。独立于三省六部之外，专职弹劾百官、纠察朝仪与参与重大案件审理，是悬在百官头顶的达摩克利斯之剑。",
                            "allusions": [
                                {
                                    "title": "台门北开与冬杀之义",
                                    "text": "御史台的办公衙门大门向北开。古人认为法司主阴，取‘冬杀之义’，象征着御史纠弹百官的铁面无私与让贪官污吏闻风丧胆的肃杀之气。"
                                }
                            ],
                            "poetry": [
                                {
                                    "author": "傅玄",
                                    "poem": "每有奏劾，竦踊不寐，坐而待旦，于是贵游慑伏，台阁生风。（赏析：生动刻画了御史台官员风闻言事、不畏权贵，令朝野震动、权倾朝野者慑伏的凛然之威。）"
                                }
                            ],
                            "children": [
                                {
                                    "id": "yushi_dafu",
                                    "title": "御史大夫",
                                    "type": "admin",
                                    "level": "从三品",
                                    "salary": {
                                        "lu_mi": "360",
                                        "yue_feng": "5100",
                                        "shi_liao": "1100",
                                        "za_yong": "900",
                                        "zhi_tian": "900"
                                    },
                                    "description": "御史台的最高长官。掌管全国监察大权，拥有不经刑部直接审问高级官员的特权，是朝廷整顿吏治的终极威慑力量。",
                                    "figures": [
                                        "娄师德",
                                        "宋璟",
                                        "张蕴古",
                                        "魏征"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "唾面自干",
                                            "text": "御史大夫娄师德为人宽厚忍让。其弟被任命为代州刺史，临行前娄师德告诫他，如果有人朝你脸上吐唾沫，不要擦，让它自己干掉，以免激怒对方。此为“唾面自干”典故由来。"
                                        }
                                    ]
                                },
                                {
                                    "id": "yushi_zhongcheng",
                                    "title": "御史中丞",
                                    "type": "admin",
                                    "level": "正五品上",
                                    "salary": {
                                        "lu_mi": "200",
                                        "yue_feng": "3000",
                                        "shi_liao": "600",
                                        "za_yong": "600",
                                        "zhi_tian": "600"
                                    },
                                    "description": "御史台的副长官，常为御史台的实际主事人，对朝臣的贪赃枉法具有极高的震慑力。"
                                },
                                {
                                    "id": "jiancha_yushi",
                                    "title": "监察御史",
                                    "type": "admin",
                                    "level": "正八品下",
                                    "salary": {
                                        "lu_mi": "60",
                                        "yue_feng": "1300",
                                        "shi_liao": "300",
                                        "za_yong": "250",
                                        "zhi_tian": "250"
                                    },
                                    "description": "隶属御史台察院。官阶虽低，但代天子巡视地方，权限极大。可风闻言事，直接弹劾地方刺史等封疆大吏的贪墨枉法行为。",
                                    "figures": [
                                        "元稹",
                                        "颜真卿 (曾任)"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "分巡十道与东川劾案",
                                            "text": "监察御史虽仅为正八品，但代表天子巡视天下十道。著名诗人元稹在担任监察御史出使东川时，不畏权贵，一次性弹劾了数十名贪官污吏，令地方豪强闻风丧胆。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "王维",
                                            "poem": "忽逢青鸟使，邀入赤松家。（赏析：古人常以“青鸟使”代指天子的使臣或监察御史，体现了这一职位代天巡狩的神秘与清贵。）"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "dalisi",
                            "title": "大理寺",
                            "type": "admin",
                            "level": "从三品机构",
                            "salary": {
                                "remark": "机构无定禄，依具体职事官品阶发放"
                            },
                            "description": "大唐帝国最高法院。负责审理中央百官犯罪及京师重案。所有死刑案件必须经大理寺仔细推勘、复核，以昭示国家慎刑恤杀的法治精神。",
                            "children": [
                                {
                                    "id": "dalisi_qing",
                                    "title": "大理寺卿",
                                    "type": "admin",
                                    "level": "从三品",
                                    "salary": {
                                        "lu_mi": "360",
                                        "yue_feng": "5100",
                                        "shi_liao": "1100",
                                        "za_yong": "900",
                                        "zhi_tian": "900"
                                    },
                                    "description": "大理寺最高长官，全国的“最高法院院长”，执掌国家刑狱审判的大权，负责天下死刑与疑难重案的最终推勘。",
                                    "figures": [
                                        "徐有功",
                                        "戴胄",
                                        "狄仁杰",
                                        "李端"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "狄公断狱",
                                            "text": "狄仁杰担任大理寺卿期间，在短短一年内清理了大量积压多年的案件，涉及一万七千余人，竟无一人喊冤，创下了大理寺有史以来的办事速率与公平神话。"
                                        },
                                        {
                                            "title": "守法不阿",
                                            "text": "武则天时期酷吏横行，大理寺卿（及少卿）徐有功独守法理，多次与武则天及周兴、来俊臣等酷吏当朝廷争，不惜以死抗命，保全了数百家无辜者的性命。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "陈子昂",
                                            "poem": "仲尼推太甲，法网何森森。"
                                        }
                                    ]
                                },
                                {
                                    "id": "dalisi_cheng",
                                    "title": "大理寺丞",
                                    "type": "admin",
                                    "level": "从六品上",
                                    "salary": {
                                        "lu_mi": "90",
                                        "yue_feng": "2000",
                                        "shi_liao": "400",
                                        "za_yong": "400",
                                        "zhi_tian": "400"
                                    },
                                    "description": "大理寺内部负责具体案件审查、推勘的骨干官员，要求精通大唐律法。"
                                }
                            ]
                        },
                        {
                            "id": "guozijian",
                            "title": "国子监",
                            "type": "admin",
                            "level": "从三品机构",
                            "salary": {
                                "remark": "机构无定禄，依具体职事官品阶发放"
                            },
                            "description": "大唐帝国的‘最高学府’与教育行政主管部门。统辖国子学、太学、四门学等，掌管天下学子的教导与经义考订，汇聚了全国最顶尖的知识精英。",
                            "figures": [
                                "孔颖达",
                                "韩愈 (曾任国子祭酒)"
                            ],
                            "allusions": [
                                {
                                    "title": "五经正义",
                                    "text": "唐太宗命国子祭酒孔颖达等大儒编修《五经正义》，将其作为国子监及天下学子的统一标准教材，彻底确立了唐代儒学正统，影响后世上千年。"
                                }
                            ],
                            "poetry": [
                                {
                                    "author": "韩愈",
                                    "poem": "师者，所以传道受业解惑也。"
                                }
                            ]
                        },
                        {
                            "id": "neishi_sheng",
                            "title": "内侍省",
                            "type": "admin",
                            "level": "从三品机构",
                            "salary": {
                                "remark": "机构无定禄，依具体宦官品阶发放"
                            },
                            "description": "唐代专职侍奉皇帝生活起居的皇家内廷机构，其成员全部由宦官组成。中晚唐时期，宦官通过掌握神策军等禁军，权力急剧膨胀，甚至能够操纵宰相任免与废立皇帝。",
                            "children": [
                                {
                                    "id": "neishi_jian",
                                    "title": "内侍监",
                                    "type": "admin",
                                    "level": "从三品",
                                    "salary": {
                                        "lu_mi": "360",
                                        "yue_feng": "5100",
                                        "shi_liao": "1100",
                                        "za_yong": "900",
                                        "remark": "常获巨额金帛赏赐"
                                    },
                                    "description": "内侍省的最高长官，宦官品阶的天花板。是皇帝身边最亲近的生活总管，常因深受信任而权势熏天。",
                                    "allusions": [
                                        {
                                            "title": "力士脱靴",
                                            "text": "李白在长安为翰林供奉时，狂傲不羁，曾让权倾朝野的内侍省最高长官高力士为自己脱靴，展现了盛唐文人藐视权贵、向往自由的傲骨。"
                                        }
                                    ],
                                    "figures": [
                                        "高力士",
                                        "仇士良"
                                    ]
                                },
                                {
                                    "id": "shencejun_zhongwei",
                                    "title": "神策军护军中尉",
                                    "type": "military",
                                    "level": "统兵宦官（特职）",
                                    "salary": {
                                        "remark": "特职厚禄，因掌控军权常获皇帝巨额内库金帛赏赐，非定额可计"
                                    },
                                    "description": "中晚唐特有职务。皇帝因不信任外廷武将，将最精锐的禁卫军‘神策军’交由太监统领，这直接导致了宦官专权，成为其废立皇帝、屠杀朝臣的暴力后盾。",
                                    "figures": [
                                        "仇士良",
                                        "鱼恩慈"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "甘露之变",
                                            "text": "唐文宗不堪宦官欺凌，密谋诛杀宦官夺回皇权。却被神策军中尉仇士良发觉，仇士良立刻调动神策军禁卫，在大明宫内大肆屠杀朝廷重臣，史称“甘露之变”。此后大唐皇权彻底沦丧于宦官之手。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "李商隐",
                                            "poem": "空闻紫阁赴甘泉，谅暗同悲万乘权。（赏析：晚唐诗人对皇权旁落宦官之手、朝局动荡的深刻悲哀与无奈。）"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "tang_local_government",
                    "title": "大唐地方行政州县体系",
                    "level": "统辖机构",
                    "salary": {
                        "remark": "统辖机构无定禄，依具体职事官品阶发放"
                    },
                    "description": "唐代实行州（郡）、县两级地方管理制度，中央权力通过州刺史与县令直接触达基层社会。而地方佐官制度的演变，则深刻倒映了中晚唐的政治倾轧与贬谪文化。",
                    "children": [
                        {
                            "id": "zhou_government",
                            "title": "州衙（郡）",
                            "type": "admin",
                            "level": "地方州级政权",
                            "salary": {
                                "remark": "行政统辖层级，无独立俸禄"
                            },
                            "description": "唐代的地方高级行政区划，分为上、中、下州，管辖数个县。",
                            "children": [
                                {
                                    "id": "cishi",
                                    "title": "刺史",
                                    "type": "admin",
                                    "level": "从三品至正四品下",
                                    "salary": {
                                        "lu_mi": "300-360",
                                        "yue_feng": "3500-5100",
                                        "zhi_tian": "700-900",
                                        "remark": "视州之上中下定等"
                                    },
                                    "description": "大唐地方州的最高行政长官，相当于现代的‘省市一把手’。总揽一州的民政、财政与司法大权，负有造福一方、教化百姓的重任，受中央御史台的监督。",
                                    "figures": [
                                        "白居易",
                                        "刘禹锡",
                                        "颜真卿"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "宜民善俗",
                                            "text": "白居易被贬为忠州刺史后，不仅没有颓废，反而积极理政、植树造林，造福一方，八百年后明代州民仍为其建白公祠世代纪念。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "白居易",
                                            "poem": "最忆东坡红烂熳，野桃山杏水林檎。（赏析：白居易在忠州刺史任上亲手种下花树，即使离开后仍满怀深情地忆起这片土地。）"
                                        }
                                    ]
                                },
                                {
                                    "id": "biejia",
                                    "title": "别驾",
                                    "type": "admin",
                                    "level": "从四品下至从五品下",
                                    "salary": {
                                        "lu_mi": "160-260",
                                        "remark": "辅以相应的月俸及职田"
                                    },
                                    "description": "州刺史的副手之一。初唐时地位极高，随刺史巡视辖境，后逐渐沦为闲职安置官。"
                                },
                                {
                                    "id": "zhangshi",
                                    "title": "长史",
                                    "type": "admin",
                                    "level": "从五品上至正六品下",
                                    "salary": {
                                        "lu_mi": "100-160",
                                        "remark": "辅以相应的月俸及职田"
                                    },
                                    "description": "州府的佐官，地位仅次于别驾。负责总管州府的各项繁琐内务与文案。"
                                },
                                {
                                    "id": "sima",
                                    "title": "司马",
                                    "type": "admin",
                                    "level": "从五品下至从六品上",
                                    "salary": {
                                        "lu_mi": "90-160",
                                        "remark": "贬官虽无实权但高薪照发，辅以相应的月俸及职田"
                                    },
                                    "description": "州刺史的佐官。中晚唐后受节度使排挤彻底沦为闲职，成了皇帝安置被贬谪京官的‘万能垃圾桶’。空有高薪而无实权，专供文人面壁思过。",
                                    "figures": [
                                        "白居易",
                                        "刘禹锡",
                                        "柳宗元"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "二王八司马",
                                            "text": "唐顺宗时期永贞革新失败，参与变法的核心官员刘禹锡、柳宗元等八人被集体贬为偏远之地的州司马，造就了唐代文学史上最悲壮的贬谪天团。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "白居易",
                                            "poem": "座中泣下谁最多？江州司马青衫湿。（赏析：白居易被贬江州司马，听闻琵琶女身世后产生强烈的政治共鸣，‘司马’成为中国文人怀才不遇的文化图腾。）"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "xian_government",
                            "title": "县衙",
                            "type": "admin",
                            "level": "地方县级政权",
                            "salary": {
                                "remark": "行政统辖层级，无独立俸禄"
                            },
                            "description": "大唐帝国的基层行政单位，负责将国家庞大的政令直接触达百姓。",
                            "children": [
                                {
                                    "id": "xianling",
                                    "title": "县令",
                                    "type": "admin",
                                    "level": "正五品上至从七品下",
                                    "salary": {
                                        "lu_mi": "70-200",
                                        "yue_feng": "1750-3000",
                                        "zhi_tian": "350-600",
                                        "remark": "视赤、畿、望、紧、上、中、下县之等级而定"
                                    },
                                    "description": "大唐基层的最高长官，老百姓眼中真正的‘父母官’。负责一县的赋税征收、户口管理与治安诉讼，是国家各项宏伟政令落地基层的最终执行者。",
                                    "figures": [
                                        "狄仁杰 (曾任彭泽令)",
                                        "王昌龄 (曾任江宁令)",
                                        "陶渊明 (晋代彭泽令，文化图腾)"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "弦歌之治",
                                            "text": "古人常以‘弦歌’指代县令以礼乐教化百姓的德政。名相狄仁杰在早年担任彭泽县令时，勤政爱民，甚至在离任后，当地百姓自发为其建立生祠世代供奉。"
                                        },
                                        {
                                            "title": "不为五斗米折腰",
                                            "text": "虽为晋代典故，但深刻影响了唐代士大夫。陶渊明任彭泽令时，不愿为区区五斗米俸禄向粗俗的督邮卑躬屈膝，辞官归隐，成为后世无数县衙底层文官的精神寄托。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "王昌龄",
                                            "poem": "洛阳亲友如相问，一片冰心在玉壶。（赏析：王昌龄任江宁县令被贬时所作，借玉壶冰心表明自己在地方为官的清正廉洁与孤高品格。）"
                                        }
                                    ]
                                },
                                {
                                    "id": "xiancheng",
                                    "title": "县丞",
                                    "type": "admin",
                                    "level": "从八品下至正九品下",
                                    "salary": {
                                        "lu_mi": "40-50",
                                        "remark": "辅以相应的月俸及职田"
                                    },
                                    "description": "县令的副手，古代县里的‘二把手’。负责协助县令处理各项政务、查对账目与文书。"
                                },
                                {
                                    "id": "zhubu",
                                    "title": "主簿",
                                    "type": "admin",
                                    "level": "正九品上至从九品上",
                                    "salary": {
                                        "lu_mi": "30-40",
                                        "yue_feng": "1050",
                                        "shi_liao": "250",
                                        "za_yong": "200",
                                        "zhi_tian": "200"
                                    },
                                    "description": "县衙内的核心文秘官员。负责起草公文、管理印鉴和审查各类行政卷宗，事无巨细皆需经手。"
                                },
                                {
                                    "id": "xianwei",
                                    "title": "县尉",
                                    "type": "admin",
                                    "level": "从九品上至从九品下",
                                    "salary": {
                                        "lu_mi": "30",
                                        "yue_feng": "1050",
                                        "shi_liao": "250",
                                        "za_yong": "200",
                                        "zhi_tian": "200"
                                    },
                                    "description": "县衙中的‘公安局长’，位于正规官品的最底层。专职负责全县的缉捕盗贼、治安管理与赋税催收。因事务繁剧，常惹民怨，却是许多著名诗人初入仕途的起点。",
                                    "figures": [
                                        "杜审言",
                                        "白居易"
                                    ],
                                    "allusions": [
                                        {
                                            "title": "傲世隰城尉",
                                            "text": "杜甫的祖父杜审言才华横溢却恃才傲物。他在担任隰城尉时，经常口出狂言，甚至扬言自己的文章能让屈原、宋玉做衙门下属，让王羲之北面称臣，虽引人嫉恨，却留下了‘傲世’的狂士之名。"
                                        }
                                    ],
                                    "poetry": [
                                        {
                                            "author": "白居易",
                                            "poem": "吏禄三百石，岁晏有余粮。（赏析：白居易曾任盩厔县尉，他在诗中借汉代县尉三百石的典故指代自身，感叹自己作为底层官员依然能有余粮，而百姓却忍饥挨饿，体现了悲天悯人的情怀。）"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": "grassroots_staff",
                            "title": "基层胥吏与差役",
                            "type": "admin",
                            "level": "无品阶（流外）",
                            "salary": {
                                "remark": "无朝廷正规品阶定禄，多靠公廨钱补贴"
                            },
                            "description": "九品以外的非正式官员群体。他们没有官身，地位卑微，却包揽了古代衙门里绝大部分的实际运转工作。",
                            "children": [
                                {
                                    "id": "xuli_shiye",
                                    "title": "幕僚（师爷）",
                                    "type": "admin",
                                    "level": "无",
                                    "salary": {
                                        "remark": "无朝廷定禄，由聘请的地方长官从个人俸禄或公廨钱中自掏腰包支付束脩"
                                    },
                                    "description": "地方大员或州县官私人自费聘请的智囊与文案参谋。在唐代多称为‘幕宾’或‘幕僚’，‘师爷’一词在明清才广泛流行。他们虽无官秩，但凭借法律与钱谷专业知识，常能左右长官决策。"
                                },
                                {
                                    "id": "buliangren",
                                    "title": "不良人（捕快）",
                                    "type": "admin",
                                    "level": "贱役",
                                    "salary": {
                                        "remark": "无朝廷定禄，倚靠衙门微薄杂务补贴或民间索取的规费维生"
                                    },
                                    "description": "唐代县衙中专职负责侦缉、抓捕盗贼的基层差役。其统领被称为‘不良帅’，职责相当于后世的‘捕快’和‘捕头’。在古代阶级划分中，他们属于没有社会地位的贱役阶层。"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "tang_military_system",
                    "title": "大唐禁军与十六卫体系",
                    "level": "统辖机构",
                    "salary": {
                        "remark": "统辖机构无定禄，依具体职事官品阶发放"
                    },
                    "description": "唐代军事防御的骨干力量，以南衙十六卫与北衙禁军构成了护卫京师与统领全国府兵的最高武力中枢，孕育了大唐全盛时期四方臣服的尚武基因。",
                    "children": [
                        {
                            "id": "shiliu_wei_dajiangjun",
                            "title": "十六卫大将军",
                            "type": "military",
                            "level": "正三品",
                            "salary": {
                                "lu_mi": "400",
                                "yue_feng": "5100",
                                "shi_liao": "1100",
                                "za_yong": "900",
                                "zhi_tian": "900"
                            },
                            "description": "南衙十六卫的最高统帅。不仅负责守卫大唐皇宫与京畿重地，更名义上统领天下折冲府的府兵。将领多由战功赫赫的猛将担任，享有极高荣誉，出将入相。",
                            "figures": [
                                "秦琼",
                                "尉迟敬德",
                                "薛仁贵"
                            ],
                            "allusions": [
                                {
                                    "title": "骏马雕戈与男儿意气",
                                    "text": "唐代将领极度重军功与骏马。十六卫的将军们常配红缰金鞍，驰骋疆场。骏马在唐朝不仅是战争机器，更是建功立业与侠客意气的精神载体。"
                                }
                            ],
                            "poetry": [
                                {
                                    "author": "岑参",
                                    "poem": "待君东去扫胡尘，为君一日行千里。（赏析：诗人借赞美军中赤骠马，寄托了渴望大唐武将骑乘骏马扫平叛乱、建功立业、捍卫帝国无上荣光的热血豪情。）"
                                }
                            ]
                        },
                        {
                            "id": "shiliu_wei_jiangjun",
                            "title": "十六卫将军",
                            "type": "military",
                            "level": "从三品",
                            "salary": {
                                "lu_mi": "360",
                                "yue_feng": "5100",
                                "shi_liao": "1100",
                                "za_yong": "900",
                                "zhi_tian": "900"
                            },
                            "description": "十六卫大将军的副手，协同大将军统领禁卫与府兵，保卫京畿安全。"
                        }
                    ]
                }
            ]
        }
    },
    {
        "id": "ming",
        "name": "明朝",
        "structure": {
            "id": "ming_emperor",
            "title": "皇帝",
            "level": "最高统治者",
            "bgImage": "/assets/ui/emperor-bg.png",
            "hideText": true,
            "hideBorder": true,
            "description": "大明朝最高独裁者，大权独揽。",
            "children": [
                {
                    "id": "neige",
                    "title": "内阁",
                    "type": "admin",
                    "level": "正五品(初)至正一品",
                    "description": "起初仅为皇帝顾问，后掌握\"票拟\"大权，成为事实上的宰相机构。长官为内阁首辅。",
                    "allusions": [
                        {
                            "title": "票拟与批红",
                            "text": "内阁大学士在奏折上拟定处理意见称为\"票拟\"，交由皇帝（或代笔太监）用红笔批示称为\"批红\"。内阁借此掌握了国家实际政务大权。"
                        }
                    ],
                    "poetry": [
                        {
                            "author": "解缙",
                            "poem": "墙上芦苇，头重脚轻根底浅；\n山间竹笋，嘴尖皮厚腹中空。"
                        }
                    ],
                    "children": [
                        {
                            "id": "shoufu",
                            "title": "内阁首辅职位",
                            "level": "正一品",
                            "description": "内阁的首领，权倾朝野，掌握处理全国政务最高权力的人。",
                            "figures": [
                                "解缙 (永乐)",
                                "杨士奇 (仁宣)",
                                "严嵩",
                                "张居正 (万历)",
                                "张居正"
                            ],
                            "allusions": [
                                {
                                    "title": "万历新政",
                                    "text": "张居正担任首辅期间，推行考成法、一条鞭法，使得明朝国库充盈，边防巩固，是明代最著名的政治家之一。"
                                }
                            ],
                            "poetry": [
                                {
                                    "author": "张居正",
                                    "poem": "愿以深心奉尘刹，不予自身求利益。"
                                }
                            ]
                        },
                        {
                            "id": "cifu",
                            "title": "内阁次辅",
                            "level": "从一品",
                            "description": "地位仅次于首辅的内阁大学士。"
                        }
                    ]
                },
                {
                    "id": "liubu",
                    "title": "六 部",
                    "type": "admin",
                    "level": "正二品",
                    "description": "明太祖废中书省后，六部直接对皇帝负责。各部尚书为长官。",
                    "children": [
                        {
                            "id": "m_libu",
                            "title": "吏 部",
                            "type": "personnel",
                            "level": "正二品",
                            "description": "掌管全国官吏的任免、考选、升降、调动等职，被誉为\"天官\"，位列六部之首。",
                            "figures": [
                                "海瑞 (曾任吏部右侍郎)"
                            ],
                            "allusions": [
                                {
                                    "title": "海瑞罢官",
                                    "text": "海瑞一生刚直不阿，在任用官员和整顿吏治方面铁面无私，深得民心，但也屡遭贬谪。"
                                }
                            ],
                            "poetry": [
                                {
                                    "author": "海瑞",
                                    "poem": "三生不改冰霜操，万死常留社稷身。"
                                }
                            ]
                        },
                        {
                            "id": "m_hubu",
                            "title": "户 部",
                            "type": "finance",
                            "level": "正二品",
                            "description": "掌管天下土地、户籍、赋税、财政收支。"
                        },
                        {
                            "id": "m_libu2",
                            "title": "礼 部",
                            "type": "rites",
                            "level": "正二品",
                            "description": "掌管典章法度、祭祀、学校、科举和外宾接待。"
                        },
                        {
                            "id": "m_bingbu",
                            "title": "兵 部",
                            "type": "military",
                            "level": "正二品",
                            "description": "掌管武官选用，调兵权仍在皇帝手中。",
                            "panelImage": "/assets/content/bingbu_rider.png"
                        },
                        {
                            "id": "m_xingbu",
                            "title": "刑  部",
                            "type": "justice",
                            "level": "正二品",
                            "description": "主管全国刑罚、法律政令。"
                        },
                        {
                            "id": "m_gongbu",
                            "title": "工  部",
                            "type": "public_works",
                            "level": "正二品",
                            "description": "主管工程营造、水利建设。"
                        }
                    ]
                },
                {
                    "id": "zhengyuan",
                    "title": "都察院",
                    "type": "supervisory",
                    "level": "正二品",
                    "description": "最高监察机构，主掌弹劾及建言，与六科给事中合称\"科道\"。",
                    "children": []
                },
                {
                    "id": "changwei",
                    "title": "厂卫",
                    "type": "intelligence",
                    "level": "特务机构",
                    "description": "明代特有的宦官（东厂、西厂等）与武职（锦衣卫）侦缉机构，直接听命于皇帝。",
                    "figures": [
                        "魏忠贤 (东厂提督)",
                        "纪纲 (锦衣卫指挥使)"
                    ],
                    "allusions": [
                        {
                            "title": "锦衣夜行",
                            "text": "锦衣卫不仅负责皇帝仪仗，更拥有诏狱，可以越过正常的司法程序直接逮捕、审讯官员，制造了诸多冤假错案。"
                        }
                    ],
                    "poetry": [
                        {
                            "author": "明人（无名氏）",
                            "poem": "缇骑四出，天下骚动。"
                        }
                    ],
                    "children": []
                }
            ]
        }
    }
];
