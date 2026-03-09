# 💰 任务交接文档：商业变现与造办处引流 (Milestone 3 Handover)

此文档针对《青云志》项目的**商业化变现漏斗**（即里程碑三），提供给接任 Agent 的前后端开发与埋点集成指南。

## 🎯 核心目标 (Context & Objectives)
在不破坏“纯粹中国古代官制科普”体验的前提下，利用“入仕模拟器”产生的高情绪价值裂变流量，将其顺滑地导流至电商平台（淘宝/微店/小红书等）。
为此，我们需要搭建一个极简的新中式无头电商画廊——**“造办处” (The Imperial Workshop)**，并通过唯一的匿名 UUID 进行全链路的用户点击埋点追踪。

相关 BACKLOG 任务 ID：`#099`, `#100`, `#102`。

---

## 🔨 任务拆解与执行顺序 (Execution Plan)

### 阶段一：后端数据表与埋点接口设定 (Backend Schema & API)
**目标**：在现有的 Directus (Node.js + PostgreSQL) 后台中建立商品表与埋点收集表。
1. **商品陈列表 (`products`)**:
   * 打开 Directus 后台（或使用 SDK），新建 Collections: `products`。
   * 字段：`id` (主键), `name` (商品名,如“大唐通宝折扇”), `description` (商品古风文案), `image` (关联 Directus Files 的封面图), `external_url` (外部电商跳转链接), `status` (上下架状态), `sort` (排序)。
   * **权限**：在 Public Policy 中，给予 `products` 集合的只读 (Read) 权限。
2. **埋点沉淀表 (`tracking_events`)**:
   * 新建 Collections: `tracking_events`。
   * 字段：`id` (主键), `uuid` (前端传来的匿名追踪 ID), `event_name` (事件流名称，如 `view_product`, `click_buy`, `generate_poster`), `payload` (JSON 格式，记录点击的商品 ID 或页面来源), `date_created` (默认时间戳)。
   * **权限**：在 Public Policy 中，赋予 `tracking_events` 集合**仅新增 (Create)** 的权限。

### 阶段二：“造办处” 独立画廊页开发 (The Imperial Workshop UX) - [Task #099]
**目标**：提供一个纯粹的、无购物车概念的极简商品展览馆。
1. **侧边栏入口导航**：
   * 修改 `src/components/Sidebar.jsx`。
   * 新增一个常驻导航项，命名为**“造办处”**（或“珍宝阁”）。图标推荐使用折扇、锦囊或卷轴等蕴含古代色彩的 SVG 图标。
2. **画廊组件开发**：
   * 新建 `src/components/ImperialWorkshop.jsx` 并在 `App.jsx` 的路由/Tab 体系中完成注册。
   * 界面风格：延续项目整体的 **Neo-Chinese Minimalist (新中式极简)** 原则。使用宣纸底带暗纹 (`bg-board`)。
   * 数据加载：在 `useEffect` 中通过 `api/directus.js` 拉取 `products` 表的数据。
   * 布局交互：采用**错落有致的瀑布流或宽间距的画廊网格 (Grid)**。商品卡片底部不需要生硬的“购买”字样，一律替换为“**请回案头**”或“**赏鉴**”等高雅的 CTA (Call-to-Action) 按钮。 
   * 悬浮动效：商品图片需配合 `object-fit: cover`， hover 时可带微弱的水墨晕染阴影 (box-shadow) 放大。 

### 阶段三：全链路埋点拦截与顺水推舟引流机制 - [Task #100 & #102]
**目标**：打通用户点击并重定向到外部电商平台的追踪链路，以及模拟器结果页的巧妙串联。
1. **埋点追踪集成 (`#100`)**:
   * 在前端 `src/api/directus.js` 中新增方法：`trackEvent(eventName, payload)`。
   * 该方法从 `localStorage` 中获取 `qyz_anon_id`，并向后端 `/items/tracking_events` 发送一条 POST 记录。
   * 在“造办处”点击“请回案头”时：**首先 `await trackEvent('click_buy', { productId: xxx })`，随后立即通过 `window.location.href = external_url` 无缝拉起或重定向至真正的第三方电商平台。**
2. **模拟器结果页顺水推舟关联 (`#102`)**:
   * 改造现有的“入仕模拟器”结果页（或其生成海报后的交互流）。
   * 逻辑要求：当海报在屏幕上生成并展示给用户之后，设定一个定时器 `setTimeout(..., 800)`。
   * **延迟 800ms 后**，在海报的底部或者侧边，以极轻柔的 Fade-in 动画淡入一个横向的精美 Banner（如：“*履新此职，怎能少了一把题字好扇？ 👉 赴【造办处】赏玩*”）。
   * 用户只要点击这个 Banner，立刻使其导航条跳转至“造办处”模块，并上报埋点事件 `event_name: 'click_simulation_banner'`。

---

## 📝 给 Agent 的验收清单 (Checklist for Next Agent)
- [ ] 确保在 Directus 后台建立了 `products` 和 `tracking_events` 集合，且正确配置了 Public 角色的相应权限（重要，否则前端报 403 / 401 错）。
- [ ] 确认商品图片等静态图片资源加载采用了 `object-fit` 并不存在拉伸。
- [ ] 测试核心变现链路：进入造办处 -> 点击“赏鉴” -> 调取 /items/tracking_events 成功记录 UUID -> 页面随之成功重定向至配置好的 `external_url` (如 `taobao.com/xxx`)。
- [ ] 测试“顺水推舟引流”的定时器，确保这个广告是在海报生成引发的兴奋点过后才优雅出现，毫无生硬感。
- [ ] 一切完成后，将 BACKLOG 中 `#099, #100, #102` 标记为 `Done`。
