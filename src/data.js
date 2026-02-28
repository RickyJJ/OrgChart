export const dynastyData = [
    {
        id: "tang",
        name: "唐朝",
        description: "唐代官制以三省六部制为核心。",
        structure: {
            id: "tang_emperor",
            title: "皇帝",
            englishTitle: "The Emperor",
            level: "最高统治者",
            bgImage: "/assets/ui/emperor-bg.png",
            hideText: true,
            hideBorder: true,
            description: "封建社会的最高统治者，掌握全国军政大权。",
            children: [
                {
                    id: "zhongshu",
                    title: "中书省",
                    englishTitle: "Secretariat",
                    type: "admin",
                    level: "正二品",
                    figures: ["房玄龄 (唐太宗时期中书令)", "张九龄 (玄宗时期中书令)"],
                    allusions: [
                        { title: "房谋杜断", text: "房玄龄善于谋划，杜如晦善于决断，二人同心辅佐唐太宗，成就贞观之治。房玄龄长期担任中书令，把持中枢。", loreImage: "/assets/content/horse_rider.png" }
                    ],
                    poetry: [
                        { author: "张九龄", poem: "海上生明月，天涯共此时。\n情人怨遥夜，竟夕起相思。" }
                    ],
                    children: [
                        {
                            id: "zhongshushe",
                            title: "中书舍人职",
                            level: "正五品上",
                            description: "主要负责起草诏令，参与机密。常在皇帝身边侍奉，深受信任。因掌管机要，又称'紫微舍人'。",
                            figures: ["白居易", "元稹"],
                            allusions: [
                                { title: "五朵云", text: "唐代中书舍人负责起草诏书，文字优美，被称为'五朵云'，极言其文采斐然。" }
                            ],
                            poetry: [
                                { author: "白居易", poem: "紫微阁老知公贵，玉堂学士忆同袍。" }
                            ]
                        }
                    ]
                },
                {
                    id: "menxia",
                    title: "门下省",
                    englishTitle: "Chancellery",
                    type: "supervisory",
                    level: "正二品",
                    description: "审查机构，负责审核中书省起草的诏令，若有不妥可封还（即封驳权）。长官为侍中。",
                    figures: ["魏征 (唐太宗时期侍中)"],
                    allusions: [
                        { title: "魏征进谏", text: "魏征任侍中时，多次直言劝谏唐太宗，甚至在朝堂上当面顶撞，留下了'兼听则明，偏信则暗'等千古名言。" }
                    ],
                    poetry: [
                        { author: "魏征", poem: "怨不在大，可畏惟人；载舟覆舟，所宜深慎。" }
                    ],
                    children: [
                        {
                            id: "geishizhong",
                            title: "给事中",
                            level: "正五品上",
                            description: "负责驳正政令之违失。皇帝所有的诏令文书，在正式颁发前都要经过给事中的审查。",
                            figures: ["李峤", "韩愈 (曾任)"],
                            allusions: [
                                { title: "封还诏书", text: "给事中拥有'涂归'之权，如果认为皇帝的诏书不妥，可以用笔涂去并退还，这在古代皇权社会是一种极度彰显政治清明的制度。" }
                            ],
                            poetry: [
                                { author: "韩愈", poem: "一封朝奏九重天，夕贬潮州路八千。" }
                            ]
                        }
                    ]
                },
                {
                    id: "shangshu",
                    title: "尚书省",
                    englishTitle: "Department of State Affairs",
                    type: "admin",
                    level: "正二品",
                    description: "最高行政执行机构，负责执行由中书省起草、门下省审核的政令。下辖六部，长官为尚书令（因唐太宗曾任此职，后多虚设，以左右仆射为实际长官）。",
                    children: [
                        {
                            id: "libu_personnel", title: "吏部", englishTitle: "Personnel", type: "personnel", level: "正三品", description: "掌管天下文官的任免、考课、升降、勋封、调动等事务。",
                            children: []
                        },
                        {
                            id: "hubu", title: "户部", type: "finance", level: "正三品", description: "掌管天下土地、户籍、赋税、财政收支等事务。",
                            children: []
                        },
                        {
                            id: "libu_rites", title: "礼部", type: "rites", level: "正三品", description: "掌管国家的典章法度、祭祀、学校、科举和接待外宾等事务。",
                            children: []
                        },
                        {
                            id: "bingbu", title: "兵部", englishTitle: "War", type: "military", level: "正三品", description: "掌管武将选用、军队训练、兵器制造及军令等。", panelImage: "/assets/content/bingbu_rider.png",
                            children: []
                        },
                        {
                            id: "xingbu", title: "刑部", type: "justice", level: "正三品", description: "掌管国家的法律、刑狱事务。",
                            children: []
                        },
                        {
                            id: "gongbu", title: "工部", level: "正三品", description: "掌管各项工程、工匠、屯田、水利、交通等政令。",
                            children: []
                        }
                    ]
                },
                {
                    id: "yushitai",
                    title: "御史台",
                    type: "supervisory",
                    level: "从三品",
                    description: "最高监察机构，负责弹劾百官，纠察百僚，长官为御史大夫。",
                    figures: ["狄仁杰 (曾任侍御史)", "颜真卿 (曾任殿中侍御史)"],
                    allusions: [
                        { title: "铁面无私", text: "御史们往往不畏权贵，直言弹劾。狄仁杰在任时，为了维护律法，曾多次弹劾权倾朝野的重臣。" }
                    ],
                    poetry: [
                        { author: "杜甫", poem: "明朝有封事，数问夜如何。" }
                    ],
                    children: []
                }
            ]
        }
    },
    {
        id: "ming",
        name: "明朝",
        description: "明初废除丞相，设立内阁制度。",
        structure: {
            id: "ming_emperor", title: "皇帝", level: "最高统治者", bgImage: "/assets/ui/emperor-bg.png", hideText: true, hideBorder: true, description: "大明朝最高独裁者，大权独揽。",
            children: [
                {
                    id: "neige", title: "内阁", type: "admin", level: "正五品(初)至正一品", description: "起初仅为皇帝顾问，后掌握“票拟”大权，成为事实上的宰相机构。长官为内阁首辅。",
                    figures: ["解缙 (永乐)", "杨士奇 (仁宣)", "张居正 (万历)"],
                    allusions: [
                        { title: "票拟与批红", text: "内阁大学士在奏折上拟定处理意见称为'票拟'，交由皇帝（或代笔太监）用红笔批示称为'批红'。内阁借此掌握了国家实际政务大权。" }
                    ],
                    poetry: [
                        { author: "解缙", poem: "墙上芦苇，头重脚轻根底浅；\n山间竹笋，嘴尖皮厚腹中空。" }
                    ],
                    children: [
                        {
                            id: "shoufu",
                            title: "内阁首辅职位",
                            level: "正一品",
                            description: "内阁的首领，权倾朝野，掌握处理全国政务最高权力的人。",
                            figures: ["严嵩", "张居正"],
                            allusions: [
                                { title: "万历新政", text: "张居正担任首辅期间，推行考成法、一条鞭法，使得明朝国库充盈，边防巩固，是明代最著名的政治家之一。" }
                            ],
                            poetry: [
                                { author: "张居正", poem: "愿以深心奉尘刹，不予自身求利益。" }
                            ]
                        },
                        { id: "cifu", title: "内阁次辅", level: "从一品", description: "地位仅次于首辅的内阁大学士。" }
                    ]
                },
                {
                    id: "liubu", title: "六 部", type: "admin", level: "正二品", description: "明太祖废中书省后，六部直接对皇帝负责。各部尚书为长官。",
                    children: [
                        {
                            id: "m_libu",
                            title: "吏 部",
                            type: "personnel",
                            level: "正二品",
                            description: "掌管全国官吏的任免、考选、升降、调动等职，被誉为“天官”，位列六部之首。",
                            figures: ["海瑞 (曾任吏部右侍郎)"],
                            allusions: [
                                { title: "海瑞罢官", text: "海瑞一生刚直不阿，在任用官员和整顿吏治方面铁面无私，深得民心，但也屡遭贬谪。" }
                            ],
                            poetry: [
                                { author: "海瑞", poem: "三生不改冰霜操，万死常留社稷身。" }
                            ]
                        },
                        { id: "m_hubu", title: "户 部", type: "finance", level: "正二品", description: "掌管天下土地、户籍、赋税、财政收支。" },
                        { id: "m_libu2", title: "礼 部", type: "rites", level: "正二品", description: "掌管典章法度、祭祀、学校、科举和外宾接待。" },
                        { id: "m_bingbu", title: "兵 部", type: "military", level: "正二品", description: "掌管武官选用，调兵权仍在皇帝手中。", panelImage: "/assets/content/bingbu_rider.png" },
                        { id: "m_xingbu", title: "刑  部", type: "justice", level: "正二品", description: "主管全国刑罚、法律政令。" },
                        { id: "m_gongbu", title: "工  部", type: "public_works", level: "正二品", description: "主管工程营造、水利建设。" }
                    ]
                },
                {
                    id: "zhengyuan", title: "都察院", type: "supervisory", level: "正二品", description: "最高监察机构，主掌弹劾及建言，与六科给事中合称“科道”。",
                    children: []
                },
                {
                    id: "changwei", title: "厂卫", type: "intelligence", level: "特务机构", description: "明代特有的宦官（东厂、西厂等）与武职（锦衣卫）侦缉机构，直接听命于皇帝。",
                    figures: ["魏忠贤 (东厂提督)", "纪纲 (锦衣卫指挥使)"],
                    allusions: [
                        { title: "锦衣夜行", text: "锦衣卫不仅负责皇帝仪仗，更拥有诏狱，可以越过正常的司法程序直接逮捕、审讯官员，制造了诸多冤假错案。" }
                    ],
                    poetry: [
                        { author: "明人（无名氏）", poem: "缇骑四出，天下骚动。" }
                    ],
                    children: []
                }
            ]
        }
    }
];
