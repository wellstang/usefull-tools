# 唐唐工具箱 — 工具目录

**版本**：v0.1.0  
**更新**：2026-06-23  
**工具总数**：48 个（研发 15 · 产品 8 · 运营 7 · 设计 8 · 生活 10）

> 所有工具一次性发布，首页只展示已上线工具，未完成的工具不出现在列表中。

---

## 研发工具（15）

### 1. JSON 格式化
- **路由**：`/tools/dev/json-formatter`
- **文件**：`src/views/tools/dev/JsonFormatter.vue`
- **描述**：在线美化、压缩、校验 JSON 数据
- **输入**：原始 JSON 文本（textarea）
- **输出**：格式化/压缩后的 JSON 文本 + 语法错误提示
- **操作**：美化 / 压缩 / 清空 / 复制
- **核心逻辑**：`JSON.parse()` + `JSON.stringify(null, 2)` 美化；`JSON.stringify()` 压缩；try/catch 捕获语法错误并高亮错误位置
- **依赖**：无外部依赖

---

### 2. Base64 编解码
- **路由**：`/tools/dev/base64-codec`
- **文件**：`src/views/tools/dev/Base64Codec.vue`
- **描述**：文本与 Base64 互相编解码
- **输入**：普通文本 或 Base64 字符串
- **输出**：编码/解码结果
- **操作**：编码（文本 → Base64）/ 解码（Base64 → 文本）/ 复制
- **核心逻辑**：`btoa(unescape(encodeURIComponent(text)))` 编码；`decodeURIComponent(escape(atob(base64)))` 解码，处理中文 Unicode
- **依赖**：无外部依赖

---

### 3. 时间戳转换
- **路由**：`/tools/dev/timestamp-converter`
- **文件**：`src/views/tools/dev/TimestampConverter.vue`
- **描述**：Unix 时间戳与人类可读时间互相转换，支持时区
- **输入**：Unix 时间戳（秒/毫秒）或 日期时间字符串
- **输出**：对应的日期时间 或 Unix 时间戳
- **操作**：时间戳 → 日期 / 日期 → 时间戳 / 获取当前时间戳
- **核心逻辑**：`new Date(timestamp * 1000)`；`Date.parse()`；`Intl.DateTimeFormat` 处理时区
- **依赖**：无外部依赖

---

### 4. 正则表达式测试
- **路由**：`/tools/dev/regex-tester`
- **文件**：`src/views/tools/dev/RegexTester.vue`
- **描述**：在线测试正则表达式，实时高亮匹配结果
- **输入**：正则表达式字符串 + 修饰符（g/i/m）+ 测试文本
- **输出**：高亮标记匹配位置、捕获组列表、匹配数量
- **核心逻辑**：`new RegExp(pattern, flags)` 动态构建；`matchAll()` 获取所有捕获组；HTML 转义后插入高亮 span
- **依赖**：无外部依赖

---

### 5. URL 编解码
- **路由**：`/tools/dev/url-codec`
- **文件**：`src/views/tools/dev/UrlCodec.vue`
- **描述**：URL 编码与解码转换
- **输入**：原始 URL 或 编码后的 URL
- **输出**：编码/解码结果
- **操作**：编码 / 解码 / 复制
- **核心逻辑**：`encodeURIComponent()` / `decodeURIComponent()`；完整 URL 用 `encodeURI()` / `decodeURI()`
- **依赖**：无外部依赖

---

### 6. Cron 表达式生成器
- **路由**：`/tools/dev/cron-generator`
- **文件**：`src/views/tools/dev/CronGenerator.vue`
- **描述**：可视化配置 Cron 表达式，实时展示中文解释和下次执行时间
- **输入**：可视化选择（分/时/日/月/周）或 直接输入表达式
- **输出**：标准 Cron 表达式 + 中文描述 + 最近 5 次执行时间
- **核心逻辑**：维护 5 个字段的响应式状态；中文描述规则映射；计算下次执行时间（纯 JS 实现，不依赖外部库）
- **依赖**：无外部依赖

---

### 7. 颜色格式转换
- **路由**：`/tools/dev/color-converter`
- **文件**：`src/views/tools/dev/ColorConverter.vue`
- **描述**：HEX / RGB / HSL / HSB 四种颜色格式互相转换，实时预览
- **输入**：任意一种颜色格式输入
- **输出**：其他三种格式 + 颜色预览块
- **核心逻辑**：复用 `src/utils/color.js` 中的转换函数
- **共享**：`src/utils/color.js`（与配色方案生成器、颜色提取器共享）
- **依赖**：无外部依赖

---

### 8. 行列转换工具
- **路由**：`/tools/dev/row-col-converter`
- **文件**：`src/views/tools/dev/RowColConverter.vue`
- **描述**：表格数据行转列、列转行，支持自定义分隔符
- **输入**：表格文本（tab 或逗号分隔）
- **输出**：转置后的表格文本
- **操作**：行转列 / 列转行 / 自定义分隔符
- **核心逻辑**：按行分割 → 按分隔符分列 → 矩阵转置 → 重新拼接
- **依赖**：无外部依赖

---

### 9. UUID / GUID 生成器
- **路由**：`/tools/dev/uuid-generator`
- **文件**：`src/views/tools/dev/UuidGenerator.vue`
- **描述**：批量生成 UUID v4，支持大小写、去横线等格式
- **输入**：生成数量（1-100）/ 格式选项（大写/小写/无横线）
- **输出**：UUID 列表（可一键全部复制）
- **核心逻辑**：`crypto.randomUUID()`（浏览器原生 API）；降级方案用 `Math.random()` 实现 v4
- **依赖**：无外部依赖

---

### 10. JSON ↔ YAML / CSV 互转
- **路由**：`/tools/dev/data-converter`
- **文件**：`src/views/tools/dev/DataConverter.vue`
- **描述**：JSON、YAML、CSV 三种格式任意互相转换
- **输入**：JSON / YAML / CSV 其中一种
- **输出**：目标格式
- **操作**：选择源格式 → 选择目标格式 → 转换
- **核心逻辑**：`js-yaml` 处理 YAML；`papaparse` 处理 CSV；中间统一用 JS 对象中转
- **依赖**：`js-yaml`、`papaparse`

---

### 11. 大小写格式转换
- **路由**：`/tools/dev/case-converter`
- **文件**：`src/views/tools/dev/CaseConverter.vue`
- **描述**：变量名命名风格一键互转：camelCase / PascalCase / snake_case / kebab-case / CONSTANT_CASE
- **输入**：任意风格的变量名或文本
- **输出**：5 种格式同时展示，可分别复制
- **核心逻辑**：先用正则拆词（按空格/下划线/横线/大写边界拆），再按各格式重组
- **依赖**：无外部依赖

---

### 12. 文本 Diff 对比
- **路由**：`/tools/dev/text-diff`
- **文件**：`src/views/tools/dev/TextDiff.vue`
- **描述**：两段文本对比，逐行高亮差异（新增/删除/修改）
- **输入**：左侧文本 + 右侧文本（两个 textarea）
- **输出**：并排显示，差异行用绿色（新增）/红色（删除）高亮
- **核心逻辑**：`diff` 库的 `diffLines()` 方法
- **依赖**：`diff`

---

### 13. HTML 特殊字符转义
- **路由**：`/tools/dev/html-escape`
- **文件**：`src/views/tools/dev/HtmlEscape.vue`
- **描述**：HTML 特殊字符编码与解码（`&amp;` `&lt;` `&gt;` `&nbsp;` 等）
- **输入**：原始 HTML 文本 或 转义后的文本
- **输出**：转义/反转义结果
- **操作**：转义（特殊字符 → 实体）/ 反转义（实体 → 字符）
- **核心逻辑**：维护字符映射表；字符串 replace 替换
- **依赖**：无外部依赖

---

### 14. JWT 解码器
- **路由**：`/tools/dev/jwt-decoder`
- **文件**：`src/views/tools/dev/JwtDecoder.vue`
- **描述**：粘贴 JWT Token，解析 Header 和 Payload 内容（纯客户端，不涉及验签）
- **输入**：JWT Token 字符串（Bearer xxx 格式自动去除 Bearer）
- **输出**：Header JSON + Payload JSON（格式化展示）+ 过期时间提示
- **核心逻辑**：按 `.` 分割三段；Base64URL 解码（`atob` + padding 补全）；JSON.parse；检测 `exp` 字段判断是否过期
- **安全说明**：页面明确提示「此工具不验证签名，请勿用于安全校验」
- **依赖**：无外部依赖

---

### 15. HTTP 状态码速查
- **路由**：`/tools/dev/http-status-codes`
- **文件**：`src/views/tools/dev/HttpStatusCodes.vue`
- **描述**：HTTP 状态码分类展示与搜索，含中英文描述和常见使用场景
- **输入**：搜索关键词（状态码数字 或 关键词）
- **输出**：匹配的状态码列表（分组：1xx/2xx/3xx/4xx/5xx）
- **核心逻辑**：静态数据表 + 前端过滤；数据内置在文件中
- **依赖**：无外部依赖

---

## 产品工具（8）

### 16. AB 实验样本量计算器
- **路由**：`/tools/product/ab-calculator`
- **文件**：`src/views/tools/product/AbCalculator.vue`
- **描述**：根据基线转化率、MDE、显著性水平、统计功效自动计算所需样本量
- **输入**：基线转化率（%）/ 最小可检测效应 MDE（%）/ 显著性水平 α（0.05/0.01）/ 统计功效 1-β（0.8/0.9）
- **输出**：每组所需样本量 / 总样本量 / 预计实验天数（可选填每日流量）
- **核心逻辑**：正态分布双样本比例检验公式：`n = (z_α/2 + z_β)² × [p1(1-p1) + p2(1-p2)] / (p1-p2)²`；z 值硬编码常用值
- **依赖**：无外部依赖

---

### 17. 需求优先级矩阵
- **路由**：`/tools/product/priority-matrix`
- **文件**：`src/views/tools/product/PriorityMatrix.vue`
- **描述**：RICE / ICE 评分框架，可视化需求排序
- **输入**：需求列表（名称 + Reach / Impact / Confidence / Effort）
- **输出**：RICE 得分排行榜 + 可视化图表
- **操作**：新增需求 / 编辑分值 / 导出 CSV
- **核心逻辑**：RICE = (Reach × Impact × Confidence) / Effort；本地 reactive 数组维护需求列表
- **依赖**：无外部依赖

---

### 18. 用户故事生成器
- **路由**：`/tools/product/user-story-generator`
- **文件**：`src/views/tools/product/UserStoryGenerator.vue`
- **描述**：填写角色、目标、动机，生成标准格式用户故事及验收标准模板
- **输入**：角色（如「注册用户」）/ 目标（如「查看订单历史」）/ 动机（如「了解消费记录」）
- **输出**：`作为一个[角色]，我希望[目标]，以便[动机]` + 验收标准模板（Given/When/Then）
- **操作**：生成 / 复制全部 / 清空
- **核心逻辑**：模板字符串拼接；多条故事支持批量生成
- **依赖**：无外部依赖

---

### 19. 竞品对比表
- **路由**：`/tools/product/competitor-table`
- **文件**：`src/views/tools/product/CompetitorTable.vue`
- **描述**：自定义维度的竞品对比分析表，支持本地存储和导出
- **输入**：竞品名称列表 + 对比维度列表 + 各单元格评分/描述
- **输出**：结构化对比表格
- **操作**：添加竞品/维度 / 填写评分 / 导出 CSV / 本地保存
- **核心逻辑**：二维数组数据结构；`localStorage` 持久化；CSV 导出用 Blob + `URL.createObjectURL`
- **依赖**：无外部依赖

---

### 20. OKR 制定助手
- **路由**：`/tools/product/okr-assistant`
- **文件**：`src/views/tools/product/OkrAssistant.vue`
- **描述**：结构化 OKR 填写模板，O + KR 拆解，支持进度跟踪
- **输入**：Objective（目标描述）+ Key Results（2-5 条，含衡量指标和完成值）
- **输出**：标准 OKR 卡片格式 + 整体完成度计算
- **操作**：添加/删除 KR / 填写当前进度 / 导出 / 本地保存
- **核心逻辑**：OKR 完成度 = 各 KR 进度的加权平均；`localStorage` 持久化
- **依赖**：无外部依赖

---

### 21. 产品路线图
- **路由**：`/tools/product/product-roadmap`
- **文件**：`src/views/tools/product/ProductRoadmap.vue`
- **描述**：时间轴式产品路线图，可视化展示各阶段功能规划，支持导出图片
- **输入**：阶段名称（Q1/Q2 等）+ 功能列表 + 状态（计划中/进行中/已完成）
- **输出**：横向时间轴可视化
- **操作**：添加/编辑阶段 / 拖拽排序 / 导出为 PNG
- **核心逻辑**：纯 CSS 时间轴布局；`html2canvas` 导出图片
- **依赖**：`html2canvas`

---

### 22. NPS 计算器
- **路由**：`/tools/product/nps-calculator`
- **文件**：`src/views/tools/product/NpsCalculator.vue`
- **描述**：填入各评分段人数，自动计算 NPS 分数及分布图表
- **输入**：0-10 各分值的受访人数
- **输出**：NPS 分数 = 推荐者% - 贬损者% + 分布图（柱状图纯 CSS 实现）+ 评级说明
- **核心逻辑**：推荐者（9-10）/ 中立者（7-8）/ 贬损者（0-6）；NPS = (推荐者/总数 - 贬损者/总数) × 100
- **依赖**：无外部依赖

---

### 23. SWOT 分析模板
- **路由**：`/tools/product/swot-analysis`
- **文件**：`src/views/tools/product/SwotAnalysis.vue`
- **描述**：四象限 SWOT 结构化填写，支持导出为图片
- **输入**：优势（S）/ 劣势（W）/ 机会（O）/ 威胁（T）各象限内容
- **输出**：标准 2×2 SWOT 矩阵可视化
- **操作**：添加/删除条目 / 导出 PNG / 本地保存
- **核心逻辑**：四个 reactive 数组；`html2canvas` 导出图片
- **依赖**：`html2canvas`

---

## 运营工具（7）

### 24. UTM 参数生成器
- **路由**：`/tools/ops/utm-generator`
- **文件**：`src/views/tools/ops/UtmGenerator.vue`
- **描述**：营销链接 UTM 参数构建，支持批量生成多渠道链接
- **输入**：目标 URL + utm_source + utm_medium + utm_campaign + utm_term + utm_content
- **输出**：完整 UTM 链接 + 参数解析预览
- **操作**：生成 / 复制 / 批量生成（多渠道）/ 导出 CSV
- **核心逻辑**：`URLSearchParams` 构建参数；批量模式支持多行渠道输入
- **依赖**：无外部依赖

---

### 25. 活动 ROI 计算器
- **路由**：`/tools/ops/roi-calculator`
- **文件**：`src/views/tools/ops/RoiCalculator.vue`
- **描述**：活动投入产出分析，计算 ROI、CPA、ROAS 等核心指标
- **输入**：总投入成本 / 活动带来的收入（或目标转化数 + 转化价值）
- **输出**：ROI = (收入-成本)/成本 × 100% + CPA（每次转化成本）+ ROAS（广告支出回报率）
- **核心逻辑**：标准公式计算；结果用颜色标注（ROI>0 绿色/ROI<0 红色）
- **依赖**：无外部依赖

---

### 26. 用户增长漏斗计算器（AARRR）
- **路由**：`/tools/ops/aarrr-funnel`
- **文件**：`src/views/tools/ops/AarrrFunnel.vue`
- **描述**：AARRR 各环节用户数和转化率输入，可视化漏斗图
- **输入**：获客（Acquisition）/ 激活（Activation）/ 留存（Retention）/ 变现（Revenue）/ 传播（Referral）各环节用户数
- **输出**：漏斗图（纯 CSS 梯形实现）+ 各层转化率 + 关键瓶颈提示
- **核心逻辑**：相邻层级用户数之比计算转化率；识别最低转化层级
- **依赖**：无外部依赖

---

### 27. 文本统计分析器
- **路由**：`/tools/ops/text-analyzer`
- **文件**：`src/views/tools/ops/TextAnalyzer.vue`
- **描述**：实时统计字数/字符/段落/词频，并展示各平台字数限制对比
- **输入**：文本内容（textarea）
- **输出**：字符数（含/不含空格）/ 中文字数 / 英文单词数 / 行数 / 段落数 / 高频词 Top 10 + 各平台字数限制比对（微博140/微信3000/Twitter280）
- **核心逻辑**：复用 `src/utils/textStats.js`
- **共享**：`src/utils/textStats.js`（与生活「文本统计」共享核心逻辑）
- **依赖**：无外部依赖

---

### 28. 内容日历排期表
- **路由**：`/tools/ops/content-calendar`
- **文件**：`src/views/tools/ops/ContentCalendar.vue`
- **描述**：可视化内容排期，支持按周/月视图管理发布计划
- **输入**：日期 + 平台 + 内容标题 + 状态（草稿/待审/已发）
- **输出**：日历视图（月/周切换）+ 颜色状态标记
- **操作**：添加/编辑/删除内容条目 / 本地存储持久化 / 导出 CSV
- **核心逻辑**：`localStorage` 持久化；月/周日历布局纯 CSS 实现；日期计算用原生 Date API
- **依赖**：无外部依赖

---

### 29. SEO Meta 预览模拟器
- **路由**：`/tools/ops/seo-preview`
- **文件**：`src/views/tools/ops/SeoPreview.vue`
- **描述**：输入页面标题和描述，模拟 Google / Bing 搜索结果展示效果
- **输入**：页面标题（≤60字符）/ Meta 描述（≤160字符）/ URL
- **输出**：Google 风格搜索结果卡片预览 + Bing 风格预览 + 字符数提示（超限变红）
- **核心逻辑**：纯样式模拟，无 API 调用；字符截断逻辑与搜索引擎一致
- **依赖**：无外部依赖

---

### 30. 社交平台图片尺寸速查
- **路由**：`/tools/ops/social-sizes`
- **文件**：`src/views/tools/ops/SocialSizes.vue`
- **描述**：各社交平台图片/封面/头像尺寸规范速查
- **输入**：选择平台（微信/微博/小红书/抖音/LinkedIn/Instagram 等）
- **输出**：该平台所有图片规格（封面/头像/帖子图/Story）+ 尺寸标注
- **核心逻辑**：静态数据表，复用 `src/data/platformSizes.js`
- **共享**：`src/data/platformSizes.js`（与设计「设计尺寸速查表」共享数据）
- **依赖**：无外部依赖

---

## 设计工具（8）

### 31. 配色方案生成器
- **路由**：`/tools/design/color-palette`
- **文件**：`src/views/tools/design/ColorPalette.vue`
- **描述**：输入主色，自动生成完整色阶、互补色、类比色方案
- **输入**：主色（HEX 或 颜色拾色器）
- **输出**：10 级色阶（50-950）+ 互补色 + 类比色 + 分裂互补色，每个颜色可复制 HEX/RGB
- **核心逻辑**：复用 `src/utils/color.js` 的 `generatePalette()`；参考 Tailwind 色板算法（HSL 空间调整亮度）
- **共享**：`src/utils/color.js`
- **依赖**：无外部依赖

---

### 32. 渐变色生成器
- **路由**：`/tools/design/gradient-generator`
- **文件**：`src/views/tools/design/GradientGenerator.vue`
- **描述**：可视化配置 CSS 渐变，支持线性/径向渐变，实时预览并生成 CSS 代码
- **输入**：渐变类型（线性/径向）/ 角度 / 多个颜色节点（颜色 + 位置%）
- **输出**：渐变预览块 + `background: linear-gradient(...)` CSS 代码
- **操作**：拖拽调整颜色节点位置 / 添加/删除颜色节点 / 复制 CSS
- **核心逻辑**：动态拼接 CSS 渐变字符串；拖拽用 `pointer` 事件实现
- **依赖**：无外部依赖

---

### 33. 字体对比预览
- **路由**：`/tools/design/font-preview`
- **文件**：`src/views/tools/design/FontPreview.vue`
- **描述**：选择多种字体并排对比预览，支持自定义文本
- **输入**：选择字体 / 自定义预览文本 / 字号 / 字重
- **输出**：并排字体渲染预览
- **字体分层策略**：
  - **中文字体**：仅提供系统字体选项（PingFang SC / Microsoft YaHei / Noto Sans SC / Source Han Sans），直接用 `font-family` 渲染，无需网络请求。完整中文字体文件 5–15 MB，动态加载不可用。
  - **西文字体**：使用 Google Fonts CSS API 动态加载（`<link>` 注入），仅加载选中字体的 latin subset，单字体通常 < 30 KB
- **网络依赖**：西文字体加载依赖 Google Fonts CDN；中文字体无网络依赖
- **依赖**：Google Fonts CDN（西文部分，无 API Key 要求）

---

### 34. 设计尺寸速查表
- **路由**：`/tools/design/design-sizes`
- **文件**：`src/views/tools/design/DesignSizes.vue`
- **描述**：各平台图片/图标/启动页/安全区尺寸规范速查
- **输入**：搜索/筛选（iOS/Android/Web/社交平台）
- **输出**：分类尺寸列表（设备/用途/尺寸/单位/备注）
- **核心逻辑**：静态数据表，复用 `src/data/platformSizes.js`
- **共享**：`src/data/platformSizes.js`
- **依赖**：无外部依赖

---

### 35. 常用图标搜索
- **路由**：`/tools/design/icon-search`
- **文件**：`src/views/tools/design/IconSearch.vue`
- **描述**：搜索 Iconify 图标库，支持 SVG 代码复制和 Vue 组件代码复制
- **输入**：图标关键词
- **输出**：图标搜索结果 Grid（每格展示图标 + 名称）/ 点击复制 SVG 或组件代码
- **核心逻辑**：调用 Iconify 公共搜索 API（`https://api.iconify.design/search?query=xxx`，纯 GET 请求，支持跨域）
- **网络依赖**：⚠️ 此工具需要网络连接。使用 Iconify 公共 API，无 SLA 保障，离线或 API 不可用时搜索结果为空；页面需展示对应的友好提示
- **依赖**：`@iconify/vue`；Iconify 公共 API（HTTPS GET，无需 Key）

---

### 36. Box Shadow / Border Radius 编辑器
- **路由**：`/tools/design/box-shadow-editor`
- **文件**：`src/views/tools/design/BoxShadowEditor.vue`
- **描述**：可视化拖拽调整阴影和圆角参数，实时预览，一键复制 CSS
- **输入**：X偏移 / Y偏移 / 模糊半径 / 扩展半径 / 颜色 / 内/外阴影（支持多层阴影）；Border Radius 四角独立或统一调整
- **输出**：实时预览卡片 + `box-shadow: ...` CSS 代码 + `border-radius: ...` CSS 代码
- **核心逻辑**：range input 双向绑定；动态拼接 CSS 字符串；多层阴影用数组维护
- **依赖**：无外部依赖

---

### 37. CSS 单位换算
- **路由**：`/tools/design/css-unit-converter`
- **文件**：`src/views/tools/design/CssUnitConverter.vue`
- **描述**：px ↔ rem ↔ em ↔ vw ↔ vh 等 CSS 单位互换，可设置基准 font-size 和视口尺寸
- **输入**：数值 + 源单位 + 基准 font-size（默认 16px）+ 视口宽/高（默认 1440/900）
- **输出**：换算结果（同时展示全部目标单位）
- **核心逻辑**：各单位相互换算公式（统一换算成 px 作为中间量）
- **依赖**：无外部依赖

---

### 38. 图片占位符生成器
- **路由**：`/tools/design/placeholder-image`
- **文件**：`src/views/tools/design/PlaceholderImage.vue`
- **描述**：输入宽高和颜色，用 Canvas 生成纯色占位图，支持下载
- **输入**：宽度 / 高度 / 背景色 / 文字颜色 / 自定义文字（默认显示尺寸）
- **输出**：Canvas 渲染的占位图预览 + 下载 PNG 按钮 + 图片 URL（Data URL）
- **核心逻辑**：`<canvas>` 绘制矩形 + 居中文字；`canvas.toDataURL('image/png')` 导出
- **依赖**：无外部依赖

---

## 生活工具（10）

### 39. 二维码生成器
- **路由**：`/tools/life/qr-generator`
- **文件**：`src/views/tools/life/QrGenerator.vue`
- **描述**：将文字或 URL 生成二维码，支持自定义前景/背景色，可下载 PNG
- **输入**：文本/URL / 前景色 / 背景色 / 纠错级别（L/M/Q/H）/ 尺寸
- **输出**：二维码预览图 + 下载 PNG 按钮
- **核心逻辑**：`qrcode` 库的 `QRCode.toCanvas()` 方法
- **依赖**：`qrcode`

---

### 40. 密码生成器
- **路由**：`/tools/life/password-generator`
- **文件**：`src/views/tools/life/PasswordGenerator.vue`
- **描述**：生成安全随机密码，支持自定义规则和强度评估
- **输入**：密码长度（8-128）/ 包含：大写字母/小写字母/数字/特殊字符 / 排除易混淆字符（0/O/l/1）
- **输出**：生成的密码 + 强度评估（弱/中/强/极强）+ 复制按钮
- **操作**：刷新重新生成 / 批量生成（1-20个）
- **核心逻辑**：`crypto.getRandomValues()` 生成真随机数；强度评估基于熵值计算
- **依赖**：无外部依赖

---

### 41. 单位换算
- **路由**：`/tools/life/unit-converter`
- **文件**：`src/views/tools/life/UnitConverter.vue`
- **描述**：长度/重量/温度/面积/体积/速度单位换算
- **输入**：数值 + 源单位 + 目标单位（或同时展示全部）
- **输出**：换算结果（支持高精度小数）
- **操作**：切换类别（长度/重量/温度等）/ 互换源目标单位
- **核心逻辑**：所有单位统一换算到 SI 基本单位再转换；温度特殊处理（非线性）；数据复用 `src/utils/units.js`
- **依赖**：无外部依赖

---

### 42. BMI 计算器
- **路由**：`/tools/life/bmi-calculator`
- **文件**：`src/views/tools/life/BmiCalculator.vue`
- **描述**：计算 BMI 体质指数，展示健康分级和建议
- **输入**：身高（cm）/ 体重（kg）/ 年龄 / 性别
- **输出**：BMI 值 + 分级（偏瘦/正常/超重/肥胖）+ 健康建议 + 可视化 BMI 刻度条
- **核心逻辑**：BMI = 体重 / 身高²；WHO 标准分级；中国标准可选切换
- **依赖**：无外部依赖

---

### 43. 日期计算器
- **路由**：`/tools/life/date-calculator`
- **文件**：`src/views/tools/life/DateCalculator.vue`
- **描述**：两日期差值计算、指定日期加减天数、工作日计算
- **输入**（多模式）：
  - 模式1：开始日期 + 结束日期 → 相差天数/周/月/年
  - 模式2：日期 + 加减天数 → 目标日期
  - 模式3：开始/结束日期 → 工作日数（排除周末）
- **核心逻辑**：`Date` 对象差值计算；工作日过滤周六/周日
- **依赖**：无外部依赖

---

### 44. 番茄钟
- **路由**：`/tools/life/pomodoro-timer`
- **文件**：`src/views/tools/life/PomodoroTimer.vue`
- **描述**：番茄工作法计时器，25分钟专注 + 5分钟休息循环，支持响铃提醒
- **输入**：专注时长（默认25min）/ 短休息时长（默认5min）/ 长休息时长（默认15min）/ 循环数
- **输出**：倒计时圆形进度条 + 当前状态（专注中/休息中）+ 完成番茄数统计
- **核心逻辑**：复用 `src/composables/useTimer.js`；Web Audio API 生成提示音（无需音频文件）；`document.title` 动态更新
- **共享**：`src/composables/useTimer.js`
- **依赖**：无外部依赖

---

### 45. 倒计时
- **路由**：`/tools/life/countdown`
- **文件**：`src/views/tools/life/Countdown.vue`
- **描述**：自定义目标时间倒计时，显示剩余天时分秒
- **输入**：目标日期时间 + 倒计时名称（如「距离高考」）
- **输出**：大字显示剩余 DD 天 HH:MM:SS + 进度条
- **核心逻辑**：复用 `src/composables/useTimer.js`；目标时间存 `localStorage` 持久化
- **共享**：`src/composables/useTimer.js`
- **依赖**：无外部依赖

---

### 46. 年龄计算器
- **路由**：`/tools/life/age-calculator`
- **文件**：`src/views/tools/life/AgeCalculator.vue`
- **描述**：输入出生日期，精确计算年龄（年/月/日/时/分）及各类趣味统计
- **输入**：出生日期（年月日）+ 出生时间（可选）
- **输出**：精确年龄 + 已活天数 + 已活小时数 + 下次生日倒计时 + 星座 + 生肖
- **核心逻辑**：`Date` 差值精确计算；星座/生肖映射表
- **依赖**：无外部依赖

---

### 47. 文本统计
- **路由**：`/tools/life/text-counter`
- **文件**：`src/views/tools/life/TextCounter.vue`
- **描述**：实时统计文本的字符数、单词数、行数、段落数
- **输入**：文本内容（textarea）
- **输出**：字符数（含/不含空格）/ 中文字数 / 英文单词数 / 行数 / 段落数（实时更新）
- **核心逻辑**：复用 `src/utils/textStats.js`（精简版，不含词频分析）
- **共享**：`src/utils/textStats.js`（与运营「文本统计分析器」共享）
- **依赖**：无外部依赖

---

### 48. 颜色提取器
- **路由**：`/tools/life/color-extractor`
- **文件**：`src/views/tools/life/ColorExtractor.vue`
- **描述**：从本地图片中提取主色调和调色板，完全在浏览器内处理，不上传服务器
- **输入**：本地图片（拖拽 / 点击上传，支持 JPG/PNG/WebP）
- **输出**：主色（1个）+ 调色板（6-8个颜色）+ 每个颜色的 HEX/RGB 值 + 复制按钮
- **核心逻辑**：`FileReader` 读取图片 → `<canvas>` 绘制 → `getImageData()` 获取像素 → 颜色量化（简化版中位切割算法）；复用 `src/utils/color.js` 的 `extractColors()`
- **共享**：`src/utils/color.js`
- **依赖**：无外部依赖

---

## 附录：工具汇总（48 个）

> 所有工具一次性发布；标注 ⚠️ 的工具有外部网络依赖。

| # | 工具名 | 分类 | 依赖库 | 备注 |
|---|--------|------|--------|------|
| 1 | JSON 格式化 | 研发 | — | |
| 2 | Base64 编解码 | 研发 | — | |
| 3 | 时间戳转换 | 研发 | — | |
| 4 | 正则表达式测试 | 研发 | — | |
| 5 | URL 编解码 | 研发 | — | |
| 6 | Cron 表达式生成器 | 研发 | — | |
| 7 | 颜色格式转换 | 研发 | — | 共享 utils/color.js |
| 8 | 行列转换工具 | 研发 | — | |
| 9 | UUID 生成器 | 研发 | — | |
| 10 | JSON↔YAML/CSV 互转 | 研发 | js-yaml, papaparse | |
| 11 | 大小写格式转换 | 研发 | — | |
| 12 | 文本 Diff 对比 | 研发 | diff | |
| 13 | HTML 特殊字符转义 | 研发 | — | |
| 14 | JWT 解码器 | 研发 | — | |
| 15 | HTTP 状态码速查 | 研发 | — | |
| 16 | AB 实验样本量计算器 | 产品 | — | |
| 17 | 需求优先级矩阵 | 产品 | — | |
| 18 | 用户故事生成器 | 产品 | — | |
| 19 | 竞品对比表 | 产品 | — | |
| 20 | OKR 制定助手 | 产品 | — | |
| 21 | 产品路线图 | 产品 | html2canvas | CSS 保持简单避免渲染问题 |
| 22 | NPS 计算器 | 产品 | — | |
| 23 | SWOT 分析模板 | 产品 | html2canvas | CSS 保持简单避免渲染问题 |
| 24 | UTM 参数生成器 | 运营 | — | |
| 25 | 活动 ROI 计算器 | 运营 | — | |
| 26 | AARRR 漏斗计算器 | 运营 | — | |
| 27 | 文本统计分析器 | 运营 | — | 共享 utils/textStats.js |
| 28 | 内容日历排期表 | 运营 | — | |
| 29 | SEO Meta 预览模拟器 | 运营 | — | |
| 30 | 社交平台图片尺寸速查 | 运营 | — | 共享 data/platformSizes.js |
| 31 | 配色方案生成器 | 设计 | — | 共享 utils/color.js |
| 32 | 渐变色生成器 | 设计 | — | |
| 33 | 字体对比预览 | 设计 | Google Fonts CDN（西文）| ⚠️ 西文字体需网络；中文用系统字体 |
| 34 | 设计尺寸速查表 | 设计 | — | 共享 data/platformSizes.js |
| 35 | 常用图标搜索 | 设计 | @iconify/vue | ⚠️ 需网络，Iconify 公共 API |
| 36 | Box Shadow 编辑器 | 设计 | — | |
| 37 | CSS 单位换算 | 设计 | — | |
| 38 | 图片占位符生成器 | 设计 | — | Canvas 实现 |
| 39 | 二维码生成器 | 生活 | qrcode | |
| 40 | 密码生成器 | 生活 | — | |
| 41 | 单位换算 | 生活 | — | |
| 42 | BMI 计算器 | 生活 | — | |
| 43 | 日期计算器 | 生活 | — | |
| 44 | 番茄钟 | 生活 | — | 共享 composables/useTimer.js |
| 45 | 倒计时 | 生活 | — | 共享 composables/useTimer.js |
| 46 | 年龄计算器 | 生活 | — | |
| 47 | 文本统计 | 生活 | — | 共享 utils/textStats.js |
| 48 | 颜色提取器 | 生活 | — | Canvas 实现，共享 utils/color.js |
