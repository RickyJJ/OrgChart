# 🚧 任务交接文档：数据结构入库与连珠解析 (Agent Handover)

此文档针对项目在完成底层数据库 Postgres 与数据中台 Directus 接入后，提供给**接任 Agent 的核心数据编排与迁移指南**。此时，后端 Node.js (基于端口 8055) 正常通讯。

## 🎯 当前所处背景 (Context)
* **任务定位**: 将目前极度冗长、难以维护且不支持跨维度搜索的纯静态硬编码树状数据对象 `src/data/data.js` 彻底拆解，并以严格的关系型+树型结构打入 PostgreSQL。
* **技术基座**: 
  * DB: Supabase (PostgreSQL 15), 且 `ltree` 扩展已经开启。
  * Backend API: Directus Node.JS 本地进程。**因此建表动作必须通过其专用的 API 调用/SDK完成**，而不是生写原始 SQL。

## 🔨 Agent 任务拆解与待办清单 (Task Breakdown)

### 阶段一：通过 Directus API / SDK 编排关系型数据集合 (Collections Schema)
你需要写一个 Node.js 的初始化脚本，通过调用原生官方的 [`@directus/sdk`](https://docs.directus.io/)（以 Admin Token 身份认证）或直接调用 REST 接口 `/collections` 与 `/fields` 在后台自动建立以下结构：

#### 1. 新建集合：`dynasties` (朝代字典表)
*   **字段**:
    *   `id` (主键, string, e.g., 'tang', 'ming')
    *   `name` (显示名称, string, e.g., '唐代', '明代')

#### 2. 新建集合：`org_nodes` (官阶职级树核心表)
这是最关键的树状体系表，因为必须适配可视化和性能检索。
*   **字段**:
    *   `id` (主键, UUID)
    *   `dynasty_id` (关联外键 -> `dynasties.id`)
    *   `title` (官职名, string, e.g., '三省六部')
    *   `level` (品阶, string, e.g., '正二品', nullable)
    *   `description` (职能白话翻译, text)
    *   `type` (枚举映射图标用, string, e.g., 'admin', nullable)
    *   `path` (🌟 架构核心：**数据类型必须为特有的 Postgres `ltree`**) 此字段记载其在继承树上的完整锚点，如 `tang.department_sheng.shangshu_sheng.bing_bu`
    *   `parent_id` (关联外键 -> 自身 `org_nodes.id`，供前端退化渲染时使用)

#### 3. 新建集合：`lopes` (典故连珠与风流人物关联表)
作为“文化虫洞”的核心搜索源。
*   **字段**:
    *   `id` (主键, UUID)
    *   `org_id` (关联外键 -> `org_nodes.id`)
    *   `type` (枚举：'figure' 人物, 'allusion' 典故, 'poetry' 诗词)
    *   `title` (展示标题或人名, string)
    *   `content` (详细诗句或翻译, text, nullable)

### 阶段二：静态数据扁平化清洗器 (Data Flattener Script)
你需要读取项目中原有的 `data.js`，该文件导出的是包含深层 `children: []` 嵌套的庞大 JSON 对象（分为 `tangData` 和 `mingData`）。你需要编写并运行一个递归扁平化脚本 (Flatten Logic)：
1.  **递归遍历**这棵树，为每一个生成的 Node 构建符合 `A.B.C` 规则的自定义 `ltree path` 字符串（用于保留空间结构）。
2.  **提取剥离**所有挂载在单一官职节点下的 `figures`（字符串数组）、`allusions`（对象数组）、`poetry`（对象数组），转换成标准化数组，准备注入上文定义的 `lopes` 副表，实现逻辑剥离。

### 阶段三：执行海量数据流式导入 (Directus Bulk Data Seeding)
扁平化数据清洗完成后，向后台接口发送真实的 Bulk Insert 请求，将这些整理完的数百条干净数据**一次性**导入关联进入数据库，从而废弃 `data.js` 的使用。

---

## 💡 给接手 Agent 的避坑提示 (Tips for the Execution Agent)
1. **不要尝试手写原生 SQL 建表。** 因为我们使用的是 Directus！手动建出的表会变成 "Unmanaged / 幽灵表"，不会出现在 Directus 可视化后台中。一定要使用 `/collections` 与 `/fields` 的 RESTful API 去建，Directus 会负责自动生成底层对应的 Postgres 强类型列。
2. 对于最重要的 `path` 字段，可以通过向 `/fields/org_nodes` POST payload 时，声明 `type: "string"` 但通过 `schema: { data_type: "ltree" }` 的方式强行覆盖底层。
3. 如果这部分通过 API 控制建表实在太过复杂，接手 Agent 也可以提示 User：**“请打开 `localhost:8055` 的管理员面版，我在左侧为你通过图形化界面手动建立这三个数据集合”**。这通常比用纯代码去操作配置驱动的 CMS 要快十倍。然后再进行脚本导库。
