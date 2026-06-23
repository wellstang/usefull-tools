# 唐唐工具箱 开发说明

## 项目简介
唐唐工具箱是一站式纯客户端实用工具集合，面向产品、运营、研发、设计等职场角色及日常生活场景，共规划 47 个工具。所有工具均在浏览器本地运行，零数据上传，无需登录，完全开源免费。

**线上地址**：https://wellstang.github.io/usefull-tools/

---

## 必读文档
开发前请完整阅读以下文档：

1. `docs/product-design.md` — 产品定位、用户画像、分类规划、UI 设计原则
2. `docs/technical-architecture.md` — 技术栈决策、目录结构、路由、组件规范、部署方案
3. `docs/tools-catalog.md` — 47 个工具详细说明（输入/输出/依赖/实现思路）

新增工具前必须先查 `docs/tools-catalog.md`，避免重复造轮子；共享工具函数在 `src/utils/` 目录，新增前先确认是否可复用。

---

## 技术栈
- **框架**：Vite 5 + Vue 3（Composition API + `<script setup>`）
- **路由**：Vue Router 4（Hash 模式，兼容 GitHub Pages 无需服务端配置）
- **样式**：Tailwind CSS 3（响应式，PC / 平板 / 手机全适配）
- **图标**：`@iconify/vue`（统一图标库，SVG 按需加载）
- **二维码**：`qrcode`（纯客户端生成）
- **差异对比**：`diff`（文本 Diff 工具）
- **YAML 处理**：`js-yaml`（JSON ↔ YAML 互转）
- **CSV 处理**：`papaparse`（JSON ↔ CSV 互转）
- **代码高亮**：`shiki`（Cron / 代码展示等场景）
- **构建产物**：纯静态文件，部署到 `gh-pages` 分支
- **CI/CD**：GitHub Actions 自动构建推送

---

## 本地开发启动

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
```

---

## 目录结构

```
usefull-tools/
├── docs/                          # 产品/架构/工具目录文档
│   ├── product-design.md
│   ├── technical-architecture.md
│   └── tools-catalog.md
├── src/
│   ├── main.js                    # 应用入口
│   ├── App.vue                    # 根组件（Router 出口）
│   ├── router/
│   │   └── index.js               # 路由表（Hash 模式）
│   ├── data/
│   │   ├── tools.js               # 工具元数据（名称/分类/路由/图标/描述/标签）
│   │   └── platformSizes.js       # 社交平台尺寸数据（设计+运营共享）
│   ├── utils/
│   │   ├── color.js               # 颜色工具函数（颜色转换/配色/提取共享）
│   │   ├── textStats.js           # 文本统计核心（运营+生活共享）
│   │   └── units.js               # 单位换算数据
│   ├── composables/
│   │   └── useTimer.js            # 计时器逻辑（番茄钟+倒计时共享）
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue      # 顶部导航（Logo + 搜索 + GitHub 链接）
│   │   │   └── AppFooter.vue      # 底部版权
│   │   └── common/
│   │       ├── ToolCard.vue       # 首页工具卡片
│   │       ├── CategoryTabs.vue   # 分类 Tab（全部/产品/运营/研发/设计/生活）
│   │       ├── ToolLayout.vue     # 工具页统一外壳（面包屑+标题+说明）
│   │       └── CopyButton.vue     # 通用复制按钮
│   └── views/
│       ├── Home.vue               # 首页（搜索 + 分类过滤 + 卡片 Grid）
│       └── tools/                 # 每个工具独立 .vue 文件
│           ├── dev/               # 研发类（14个）
│           ├── product/           # 产品类（8个）
│           ├── ops/               # 运营类（7个）
│           ├── design/            # 设计类（8个）
│           └── life/              # 生活类（10个）
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 新增工具规范（必读）

每新增一个工具，需要完成以下 3 步：

### Step 1：在 `src/data/tools.js` 注册元数据

```js
{
  id: 'json-formatter',          // 唯一 ID，kebab-case
  name: 'JSON 格式化',
  description: '在线美化、压缩、校验 JSON 数据',
  category: 'dev',               // dev | product | ops | design | life
  icon: 'mdi:code-json',         // Iconify 图标名
  route: '/tools/dev/json-formatter',
  tags: ['JSON', '格式化', '开发'],
  status: 'online',              // online | coming-soon
}
```

### Step 2：在 `src/views/tools/{分类}/` 下创建 kebab-case 命名的 `.vue` 文件

文件名必须与 `tools.js` 中 `route` 的末段一致（kebab-case），`import.meta.glob` 依赖此约定自动生成路由：

```
route: '/tools/dev/json-formatter'  →  文件名: json-formatter.vue  ✓
                                        不要用: JsonFormatter.vue    ✗
```

```vue
<template>
  <ToolLayout title="JSON 格式化" description="在线美化、压缩、校验 JSON 数据">
    <!-- 工具主体内容 -->
  </ToolLayout>
</template>

<script setup>
import ToolLayout from '@/components/common/ToolLayout.vue'
</script>
```

路由由 `import.meta.glob` 自动生成，**无需手动修改 `src/router/index.js`**。

---

## Git 工作规范
- 日常开发提交到 `dev` 分支
- **禁止直接提交到 `main` 分支**
- 开发完成后通过 PR 合并到 `main`
- `main` 分支合并后 GitHub Actions 自动构建并部署到 `gh-pages` 分支
- 仓库地址：https://github.com/wellstang/usefull-tools.git

---

## 部署规范

### 自动部署（推荐）
推送到 `main` 分支后，GitHub Actions 自动执行：
1. `npm ci`
2. `npm run build`
3. 将 `dist/` 推送到 `gh-pages` 分支

### 手动部署
```bash
npm run build
# 将 dist/ 内容推送到 gh-pages 分支
```

### GitHub Pages 配置
- 仓库 Settings → Pages → Source: `gh-pages` 分支 / `/ (root)`
- 访问地址：https://wellstang.github.io/usefull-tools/

---

## 开发规范
1. 所有工具组件必须用 `ToolLayout` 包裹，保持页面结构统一
2. 共享逻辑（颜色/文本/计时）必须放 `src/utils/` 或 `src/composables/`，不得在工具组件内重复实现
3. 不允许向任何外部服务器上传用户数据；所有处理均在浏览器本地完成
4. 工具开发完成后在 `tools.js` 将 `status` 设为 `'online'` 方可出现在首页；开发中的工具设为 `'wip'`，不对外展示
5. 每完成一个工具主动告知，等确认后再继续下一个
6. Tailwind 类名保持语义清晰，复杂样式提取为组件，避免长串 class
7. 工具页面需同时测试 PC（≥1024px）和移动端（≤768px）两种布局

---

## 当前版本

**v0.1.0**（2026年6月，开发中）

规划工具总数：48 个
- 研发（15）· 产品（8）· 运营（7）· 设计（8）· 生活（10）

所有工具一次性发布，开发完成后统一上线。

开发参考文档：
- `docs/product-design.md` — 产品需求与交互规范
- `docs/technical-architecture.md` — 技术架构
- `docs/tools-catalog.md` — 工具详细说明
