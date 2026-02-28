---
trigger: always_on
---

* **静态资源管理规则 (Asset Convention)**：
  * 所有手动提供的高保真背景纹理、UI 图标统一放置在 '/public/assets/ui/' 目录下。
  * 官职节点、历史人物相关的业务图片，统一放置在 '/public/assets/content/' 目录下。
  * **严禁在代码中硬编码业务图片路径**。所有业务图片路径必须从数据源 (JSON) 中动态读取渲染。

* **图片渲染规范 (Image Rendering)**：所有 UI 资产和插画必须在固定尺寸的容器内渲染，强制使用 object-fit: contain (或 bg-contain) 配合 background-position: center，严禁图片拉伸变形，且必须保留优雅的内外边距 (Margin/Padding)。

**语言规范**：在生成markdown文件展示你的想法或者计划或者总结时，优先以中文展示，其次是英文。