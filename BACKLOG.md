# Project Backlog & Todo

| 任务 ID | 类型 (Feature/Bug) | 描述 | 状态 (Pending/Ongoing/Done) | 对应规范章节 |
|---------|--------------------|------|-----------------------------|--------------|
| 001 | Feature | Initialize project structure | Done | 3.1 |
| 002 | Feature | Explain PLANNING mode flow | Done | N/A |
| 003 | Feature | Refine visual style to "Ink & Wash" cultural theme | Done | 1.2 |
| 004 | Feature | Add "Unrolling Scroll" entrance animation | Done | 1.2 |
| 005 | Feature | Replace generic badges with "Seal" style stamps | Done | 1.2 |
| 006 | Feature | Implementation of vertical text for traditional feel | Done | 1.2 |
| 007 | Feature | Add more dynasties (Song, Qing) | Pending | 2.1 |
| 008 | Feature | 扩充数据结构：增加典故、人物和诗词字段 | Done | 3.2 |
| 009 | Feature | 详情页重新设计：支持多维度文化内容展示 (High-Fidelity) | Done | 2.4 |
| 010 | Feature | 梳理唐代/明代核心官职的代表人物与诗词数据 | Done | 2.4 |
| 011 | Feature | 实现官职卡片的双层展开（一级内联摘要，二级侧边全量） | Done | 2.3 |
| 012 | Feature | 设计并接入官职类型的小图标/印记系统 | Done | 2.3 |
| 013 | Feature | 深度优化古风诗词展示组件（竹简/笺纸风格等） | Done | 2.4 |
| 014 | Feature | 关键信息确认或生成时，实现“朱红印章盖下”的视觉交互反馈 | Pending | 1.2 |
| 015 | Feature | 典故连珠：实现全局跨朝代模糊搜索，点击结果平滑平移(Pan)/缩放(Zoom)居中目标并自动呼出详情 | Done | 2.5 |
| 016 | Content | 典故连珠：补充“左拾遗”、“司马”等高频文化官职的具体内容及白话翻译 | Done | 2.5 |
| 017 | Feature | “入仕”模拟器：根据映射字典匹配古今职业，增强社交传播属性 | Done | 2.6 |
| 018 | Feature | 委任状海报生成：集成 html2canvas 生成带朱红印章盖印动效的分享海报 | Done | 2.6 |
| 019 | Arch | 技术栈重构：将纯前端项目迁移至 React + Vite 构建体系 | Done | 3.1 |
| 020 | UI/UX | Replace image paper texture with procedural CSS/SVG texture | Done | 1.2 |
| 021 | Design | UI大改版：全量迁移至“青云志”高保真设计图风格 (侧栏、悬浮窗、水墨卡片) | Done | 1.2 |
| 022 | Design | 生成并应用水墨飞白底纹、人物画卷和竹简图标等图片素材 | Done | 1.2 |
| 023 | Design | 皇权节点更换为自定义高清印章图片 (emperor_seal_high_res.png) | Done | 1.2 |
| 024 | Arch | 重构静态资源目录结构，将UI素材和业务内容分离至/assets/ui和/assets/content，实现业务图片全量动态渲染 | Done | 3.1 |
| 025 | Design | 严格落实图片渲染规范：全量替换为 object-fit/bg-size: contain，并补齐内外边距，严禁拉伸变形 | Done | 1.2 |
| 026 | Feature | 实现树状结构节点的收起/展开功能，卡片内部底端增加动态箭头按钮，并在父节点收起时应用层叠样式的视觉效果 | Done | 2.1 |
| 027 | Feature | Layout Optimization: Neo-Chinese Minimalist, Sidebar, Typography, Hierarchy Tree styling | Done | 1.2 |
| 028 | Feature | 将官职卡片样式重置为竖向卷轴/竹简排版（Vertical Bamboo Slip Style) | Done | 1.2 |
| 029 | Design | 为兵部添加专有插画（bingbu_rider.png）展示在详情面版中，并保持原有的卡片UI | Done | 1.2 |
| 030 | UI/UX | 解决竹简卡片英文名过长撑破布局的问题，限制卡片最大高度并允许英文字符换行 | Done | 1.2 |
| 031 | UI/UX | 详情面板文字区的水平滚动条默认隐藏，仅在鼠标悬浮时显示；并修复悬浮导致的文本排版抖动（Layout Shift）问题，保持上下布局一体性 | Done | 1.2 |
| 032 | UI/UX | 给官职树状图的背景区域增加边框素材 | Done | 1.2 |
| 033 | UI/UX | 调整并加深全局与树状图面板背景色，强化新中式复古氛围 | Done | 1.2 |
| 034 | UI/UX | 把详情面板职位名称和品阶的字体改为和树状图上的字体一致 | Done | 1.2 |
| 035 | UI/UX | 详情面板职位名称字重进一步加粗 (font-extrabold) | Done | 1.2 |
| 036 | UI/UX | 修复竹简卡片悬浮时的挂绳与锚点动画，使其在卡片上浮时视觉对齐并保持固定 | Done | 1.0 |
| 037 | Bug | 修复垂直书写模式 (writing-mode) 导致的 flex 容器物理高度塌陷及连线穿模重叠的问题 | Done | 1.2 |
| 038 | Feature | 树状图连线风格升级：从 CSS border 直角线改为 SVG 贝塞尔曲线 + feTurbulence 手绘滤镜 + 墨点装饰，契合新中式水墨主题 | Done | 1.2 |
| 039 | Bug | 修复树状图根节点与子节点不对齐及右侧卡片重叠问题：布局从 flex+float 改为 inline-block+text-align:center，确保父节点始终居中于子树上方 | Done | 1.2 |
| 040 | Feature | 应对横向宽树布局：重构架构树为全局无界画布 (Infinite Canvas)，引入平滑缩放 (Wheel Zoom) 与拖拽平移 (Pan) 交互，并重写 SVG 连线的缩放系坐标映射 | Done | 1.2 |
| 041 | UI/UX | 为“入仕模拟”板块落地基于 /ui-ux-pro-max 规范的深色模式仪表盘 (Dark Mode Neo-Chinese Bento Grid)，并嵌入 Recharts 数据图表 | Done | 2.6 |
| 042 | Bug | 修复“兵部”节点配图丢失问题：校正 data.js 中 `panelImage` 属性名为 `bgImage`，以匹配 NodeCard 渲染逻辑 | Done | 1.2 |
| 043 | UI/UX | 将生成的亚字形纯矢量牌匾轮廓应用到官职卡片上作为边框，修改 border-image 属性适配 | Done | 1.2 |
| 044 | UI/UX | 统一所有官职卡片的尺寸为固定高宽，取消随内容自适应高度 | Done | 1.2 |
| 045 | UI/UX | 扩大官位卡片的固定宽高为 w-[76px] 和 h-[260px] 提供充足空间容纳过长的英文头衔 (如 Shangshu Sheng) | Done | 1.2 |
| 046 | UI/UX | 移除卡片上显得突兀的英文文本以维持水墨文化沉浸感，保留中文，并将英文挪至右侧详情面板头部 | Done | 1.2 |
| 047 | Bug | 修复唐朝和明朝“兵部”节点被插图完全替代的问题，将 `bgImage` 字段修正为 `panelImage`，使图片仅在详情面板内展示，恢复正确的官职卡片渲染 | Done | 1.2 |
| 048 | UI/UX | 调整所有官职卡片的固定宽高为 w-[115px] h-[200px]，使其长宽比（~0.575）完美匹配生成的源牌匾图片的像素比例（286x498），做到亚字形边框零拉伸 | Done | 1.2 |
| 049 | Bug | 修复官职卡中背景色/材质覆盖并越过矢量边框（border-image）导致重叠难看的问题，通过移除 slice fill 并应用 `background-clip: padding-box` 裁切背景 | Done | 1.2 |
| 050 | UI/UX | 修复边框图片自带纯白背景遮挡卡片纸张纹理的问题：重构 CSS 将 `border-image` 移至绝对定位层并叠加 `mix-blend-mode: multiply` | Done | 1.2 |
| 051 | UI/UX | 彻底消灭原卡片底色超出矢量折角并残留白色矩形背景块的问题：移除多余层和卡片自带背景底色/阴影，实现真正的“零底色纯矢量线稿”外观 | Done | 1.2 |
| 052 | UI/UX | 全局字体古风化：引入 Ma Shan Zheng (马善政) 和 Zhi Mang Xing (志莽行书)，配置并应用至主标题及官职卡片标题 | Done | 1.2 |
| 053 | UI/UX | 根据用户反馈，将主标题和竹简卡片标题的字体从毛笔书法体调整为**思源宋体 (Noto Serif SC)**，以获得更端庄、清晰的阅读体验 | Done | 1.0 |
| 054 | UI/UX | 彻底清理官职卡片残留的 CSS `box-shadow` 和 Tailwind 阴影类 (`shadow-sm`, `shadow-md`, `drop-shadow`)，确保纯净矢量线稿视觉 | Done | 1.2 |
| 055 | UI/UX | 修复鼠标悬浮 (Hover) 时卡片内文字发虚、模糊的问题：优化 `transition-all` 为 `transition-transform` 并应用 `will-change-transform` | Done | 1.2 |
| 056 | UI/UX | 根据 UI/UX 规范重新排版朝代切换按钮，使其垂直排列在标题下方，并放大按钮尺寸以提升操作体感 | Done | 1.2 |
| 057 | Bug | 修复官职卡片挂钩（Pin/Nail）与树状连线错位问题：统一 CSS 伪元素与 SVG 连线的参考系，通过 `margin-top: -24px` 补偿边框偏移，并移除冗余 SVG 圆点 | Done | 1.2 |
| 058 | UI/UX | 增加树状图有效显示面积并优化边框视觉裁剪，确保内侧内容精确在画框边缘消失，同时保证初始渲染“皇帝”节点无遮挡 | Done | 1.2 |
| 059 | UI/UX | 优化朝代切换按钮动效：取消原来的印章播放动画，重构为更快速连贯地双向 Transform Transition，实现基于原背景图（switch-bg-1）的选中放大与失去焦点缩小同步过渡效果 | Done | 1.2 |
| 060 | UI/UX | 移除朝代切换按钮（未选中状态时）的鼠标悬浮 (Hover) 背景色块效果，保持视觉清爽 | Done | 1.2 |
| 061 | UI/UX | 替换全局官职卡片边框背景：从 `vertical_plaque_outline` 修改为您提供的白底 `card-bg-1.jpg` | Done | 1.2 |
| 062 | Bug | 修复 JPG 背景带来的多余白色四角问题：运用 `mix-blend-mode: multiply` 与移除卡片阴影的方式物理使四角透明化 | Done | 1.2 |
| 063 | UI/UX | 取消 `clip-path` 裁剪并调整卡片尺寸，以恢复被误裁的顶部装饰（钉子/挂绳）并保持原有线框布局完美缩放 | Done | 1.2 |
| 064 | UI/UX | 增加用于调试官职卡片宽度、高度和字体大小的临时悬浮面板 | Done | 1.2 | 
| 065 | UI/UX | 将卡片尺寸硬编码为宽 60px、高 210px，字号 2.5rem，并移除调试面板 | Done | 1.2 |
| 066 | UI/UX | 为超过 3 个字的冗长官位名称添加鼠标悬停留白的隐性走马灯特效（Marquee Effect），以展示完整文本 | Done | 1.2 |
| 067 | UI/UX | 替换朝代切换按钮背景图：由 switcher-bg-1 替换为 switch-bg-1 | Done | 1.2 |
| 068 | UI/UX | 调整朝代切换按钮选中背景（红笔光环）的大小为 100%，并移除临时调试面板 | Done | 1.2 |
| 069 | UI/UX | 为朝代切换按钮选中时的红环背景增加逆时针 360 度飞入旋转动效（时长 700ms） | Done | 1.2 |
| 070 | UI/UX | 优化环背景动画规则：未被选中的按钮失去焦点时不再反向旋转，而是直接淡出 | Done | 1.2 |
| 071 | UI/UX | 升级红环选中动画：利用 CSS conic-gradient 遮罩创造逆时针“毛笔挥毫作画”的笔刷手绘显现效果 | Done | 1.2 |
| 072 | UI/UX | 锁定水墨绘制参数定调（180 正下方起笔，完整挥舞画圆）并移除临时动效调试面板 | Done | 1.2 |
| 073 | Feature | 官职卡片重构：名称单列显示、跑马灯特效动画、采用card-bg进行九宫格平铺背景 | Done | 1.2 |
| 074 | Bug | 修复官职卡片文字未居中问题：改为 Flex 居中，并将背景图恢复为 card-bg-1.jpg (保持九宫格平铺) | Done | 1.2 |
| 075 | UI/UX | 加快官职卡片长文本跑马灯的往返滚动速度（由 3s 缩短至 1.8s） | Done | 1.2 |
| 076 | UI/UX | 移除长文本跑马灯动画的 0.3s 初始延迟，鼠标移动上去立刻生效 | Done | 1.2 |
| 077 | Bug | 修复官职卡片的背景图片未显示全素材内容的问题：将 `border-image` 替换为 `background-size: 100% 100%` 或等效属性 | Done | 1.2 |
| 078 | UI/UX | 将官职卡片文字字体从 font-ancient 更换为 font-serif (Noto Serif SC)，与详情面板保持一致 | Done | 1.2 |
| 079 | Bug/UI | 修复父节点收起时卡片横向位移问题，移除旧 stacked-cards 方案，重构为扇形展开（Fan-out）效果 | Done | 1.2 |
| 080 | UI/UX | 新增 card-bg-insight.png 水墨山水底纹叠加层：与原 card-bg-1.jpg 边框背景共存 | Done | 1.2 |
| 081 | Bug | 修复 NodeCard.jsx 中因 `cardDebugOverrides` 未定义导致的组件渲染崩溃 (ReferenceError) | Done | 1.2 |
| 082 | UI/UX | 去除官职卡片标题底部的半透明渐变遮罩，并将跑马灯滚动优化为仅单次触发 | Done | 1.2 |
| 083 | UI/UX | 调整跑马灯触发阈值：由 4 个字改为 5 个字（即 4 个字以内正常显示，不滚动） | Done | 1.2 |
| 084 | Feature | 皇帝根节点背景图更新为 `emperor-bg.png` 并移除文字与边框 | Done | 1.2 |
| 085 | Bug | 树状线逻辑解耦与稳定性优化：通过 Data Attributes 替换类名依赖，并固定水平连线高度，彻底解决悬停/选中导致的整行跳动问题 | Done | 1.2 |
| 086 | Feature | 典故呼吸印记 (Lore Breathing Mark)：为含有典故的官职增加极微小朱砂红动态呼吸印章 (#af292e) | Done | 1.2 |
| 087 | UI/UX | 朝代切换 UI 同步：支持从顶部下拉菜单或横向时间轴快速切换（同步 SPEC 2.1） | Cancelled | 2.1 |
| 088 | Bug | 修复树状图连线乱了的问题：引入 `top`/`bottom` 双锚点系统，并调整 CSS 间距使连线长度固定为 8px，同时消除点击卡片时的连线位移抖动，确保结构稳固 | Done | 1.2 |
| 089 | UI/UX | 同步子官职卡片与树状线的消失动画，统一使用 0.6s Quartic Out 曲线 | Done | 1.2 |
| 090 | UI/UX | 优化卡片交互逻辑：点击选中时不产生位移突跳，通过移除物理遮罩层并引入全局点击监听，实现“点击不跳动，移出自动回位”的效果 | Done | 1.2 |
| 091 | Bug | 修复皇帝根节点上方出现冗余锚点线的问题，并优化全节点容器尺寸以确保连线精准对齐 | Done | 1.2 |
| 092 | UI/UX | 点击逻辑优化：支持重复点击卡片切换（开启/关闭）详情面板 | Done | 1.2 |
| 093 | Bug | 修复折叠时子层级连线残留问题：通过 `TreeConnections.jsx` 递归检查祖先展开状态实现彻底隐藏 | Done | 1.2 |
| 094 | Feature | 典故连珠：实现全量文化看板组件 `LoreCenter.jsx` 及一键穿透定位逻辑 | Done | 2.5 |
| 095 | UI/UX | 典故连珠：根据反馈移除导航栏独立菜单入口，保持侧边栏极简，相关内容由全局搜索承接 | Done | 1.2 |
| 096 | Feature | 后端框架选型与搭建：引入基于 Node.js 生态的 Headless CMS (Directus v11.16) 提供核心文化数据分发、引流及埋点收集，并提供可视化数据后台 | Done | 3.1 |
| 097 | Feature | 数据库与检索引擎：部署 PostgreSQL 作为主数据库并启用 `ltree` 扩展，引入 Meilisearch 驱动高性能力且忽略空格的多维跨朝代检索引擎 | Ongoing | 3.1 |
| 098 | Arch | 基础设施与 CDN：配置全局 CDN 分发网络，将所有大体积高保真背景、动效与水墨遮罩等静态资源上云以应对拉新裂变高并发 | Pending | 3.1 |
| 099 | Feature | 商业引流与“造办处”文创页：增加左侧侧边常驻导航入口，实现新中式画廊式商品展示面板（无头电商展示模式） | Done | 2.7 |
| 100 | Feature | 埋点追踪与导流体系：实现前端点击文创商品时的埋点事件捕获与重定向/拉起外部小程序（淘宝/小红书等）功能 | Done | 2.7 |
| 101 | Feature | 模拟器裂变锚点升级：利用前端技术动态生成包含 UTM 参数的专属水墨二维码，集成入委任状海报右下角 | Done | 2.6 |
| 102 | Feature | 模拟器顺水推舟引流：委任海报展现后，延迟 800ms 淡入展示“文创周边”关联按钮，并支持一键无缝导航至造办处界面 | Done | 2.6 |
| 103 | Feature | 无感匿名追踪：利用 LocalStorage 或轻量浏览器指纹生成端侧匿名 UUID，以此作为用户行为埋点唯一标识发送后端 | Done | 3.1 |
| 104 | Arch | 数据结构迁移：将静态的 `data.js` 历史数据全量结构化清洗并迁移至 PostgreSQL 数据库进行动态管理 | Done | 3.1 |
| 105 | Feature | 前端 API 接入：新建 `src/api/directus.js`，实现从 Directus REST API 拉取数据、重建嵌套树并转换格式；改造 `App.jsx` 以 useEffect 异步加载，降级保留本地 data.js 兜底 | Done | 3.1 |
| 106 | Arch | Directus 公开访问配置：为 Public Policy 的 `dynasties`、`org_nodes`、`lores` 三个集合配置匿名只读权限；在 `.env` 中添加 CORS 配置允许前端开发服务器跨域访问 | Done | 3.1 |
| 107 | UI/UX | 移除侧边栏冗余的我的官职导航入口，精简 MVP UI | Done | 1.2 |
| 108 | UI/UX | 调整并完善详情面板标题区布局及样式 | Done | 2.7 |
| 109 | UI/UX | 优化导航栏 Logo 显示 | Done | 1.2 |
| 110 | UI/UX | 调整 Logo 尺寸和间距 | Done | 1.2 |
| 111 | Feature | 造办处增加喜欢按钮及按热度排序功能 | Done | 2.7 |
| 112 | Feature | 造办处增加点赞失败自动回滚机制，并弹出新中式 Toast 提示 | Done | 2.7 |
| 113 | Arch | 数据结构规范：在 SPEC.md 中增加 salary (俸禄) 字段及定义 | Done | 3.2 |
| 114 | Arch | 数据库表结构变更：在 PostgreSQL 中为 `org_nodes` 增加 `salary` 列 (JSONB 类型) | Done | 3.1 |
| 115 | Feature | 后端导入改造：修改 `import-full-json.mjs` 以解析、插入 salary 属性并重新落库 | Done | 3.1 |
| 116 | UI/UX | 详情面板升级：根据 SPEC.md 3.2.1 俸禄映射表，在 UI 渲染官职俸禄模块。要求：参考 docs/tasks/task_116_salary_ui_guide.md 实现动态映射与水墨风格展示。 | Done | 2.4 |
| 117 | UI/UX | 俸禄模块重构：实现 SalaryFlowBoard 横向流式布局与沉浸式 Tooltip 科普功能 | Done | 2.4 |
| 118 | Feature | 详情面板与模拟器联动：修改 CTA 按钮文案为“接旨赴任”，并实现点击后直接在模拟器生成对应官职委任状的“短路”逻辑 | Done | 2.7 |
| 119 | Bug | 修复详情面板属性 Tooltip 在屏幕边缘显示不完整的问题：实现自动边界检测与位置修正逻辑 | Done | 1.2 |
| 120 | Feature | 命运卷轴: UI 入场态极简输入、核心CTA按钮及海报材质开发 (Ref: docs/destiny-scroll/01-ui-ux-design.md) | Done | 2.6 |
| 121 | Feature | 命运卷轴: 朱红印章物理盖印动效与800ms文创卡片延迟淡入 (Ref: docs/destiny-scroll/02-animations-interactions.md) | Done | 2.6 |
| 122 | Feature | 命运卷轴: 黑盒随机匹配、Meilisearch 兜底与无感 UUID 追踪 (Ref: docs/destiny-scroll/03-matching-logic-tracking.md) | Done | 2.6 |
| 123 | Feature | 命运卷轴: 水墨二维码生成及前端 html2canvas海报合成 (Ref: docs/destiny-scroll/03-matching-logic-tracking.md) | Done | 2.6 |
| 124 | Bug | 修复初次加载时由于未及时拉取到数据库数据而展示本地 Mock 数据造成的显示错误，添加加载屏动画 | Done | N/A |
| 127 | UI/UX | 命运卷轴：应用 `rushi_bg.png` 作为入仕模拟器的全局背景，提升沉浸感 | Done | 2.6 |
| 130 | Feature | 命运卷轴：使用 `yinzhang.png` 作为印章背景，并动态生成职业专属文字印章 | Done | 2.6 |
| 131 | Feature | 命运卷轴：实现前端 Canvas 动态像素抠图工具以剔除海报印章白边，并封装为复用工具类 | Done | 2.6 |
| 128 | Feature | 核心知识生成引擎：基于 `@google/genai` (Gemini) 自动扫描并补全全量官职的典故、人物、诗词及职能白话翻译 | Pending | 2.4 / 3.2 |
| 129 | Arch | 知识沉淀：生成 `.knowledge.md` 针对项目架构核心逻辑、数据流转与 UX 交互标准的深度总结文档 | Pending | 3.1 |
| 135 | Feature | 命运卷轴：为朱红印章添加核心物理砸击动效 (Stamp Smash Physics) | Done | 2.6 |
| 136 | UI/UX | 命运卷轴：清洗海报现代UI元素，恢复『新中式极简风』(去除印章阴影白字、云纹背景、现代矩形容器及二维码白边) | Done | 1.2 |
| 137 | UI/UX | 命运卷轴：升级为『极简装裱』，应用纸张提亮、古法双线装裱外框以及温润物理投影 | Done | 1.2 |
| 138 | UI/UX | 命运卷轴：印章动效升级，注入 0%->55%->60%->80% 砸下挤压反弹物理缓动，并内置 Web Audio API 纯前端合成神级“砰——咚”回声音效 | Done | 1.2 |
| 140 | UI/UX | 命运卷轴：调整海报引文段落，强制职业名词独立成行并使用 whitespace-nowrap 防断行，增加行高营造新中式呼吸感 | Done | 1.2 |
| 139 | UI/UX | 命运卷轴：海报植入【大唐俸禄与恩典】题跋式竖排文本，极简字号，辅以深灰/带红深灰色彩及细线分割 | Done | 1.2 |
| 141 | UI/UX | 命运卷轴：移除官名与品阶间的红点分割符，通过 32px 留白实现极简视觉隔离 | Done | 1.2 |
| 142 | UI/UX | 命运卷轴：实现『降格排版』，官品顶部对齐并下沉 60px；提升印章 Z-index 至最高并确保『盖印透墨』视觉效果 | Done | 1.2 |
| 143 | Bug | 修复委任状主官名首字在竖排模式下被容器 overflow 裁切的问题，通过优化 paddingTop 及移除重复负边距确保视觉完整 | Done | 1.2 |
| 144 | UI/UX | 命运卷轴：升级官品样式为双线装裱印章风格，内外框线分离并维持完全透明背景 | Done | 1.2 |
| 145 | Arch | 配置项目一键启动脚本：实现 start.bat 与 npm 联合调度的全局开发者控制面板，支持前后端并行启动 | Done | 3.1 |