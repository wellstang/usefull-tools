# 唐唐工具箱 — 技术架构文档

**版本**：v0.1.0  
**更新**：2026-06-23

---

## 一、技术选型决策

### 为什么用 Vite + Vue 3

| 考量点 | 决策 | 理由 |
|--------|------|------|
| 构建工具 | Vite 5 | 秒级冷启动，HMR 极快，适合多页面工具站 |
| UI 框架 | Vue 3 | Composition API 使工具逻辑可复用（composables），SFC 组件化清晰 |
| 样式 | Tailwind CSS 3 | 无需维护 CSS 文件，响应式类名内联，移动端适配方便 |
| 路由 | Vue Router 4 Hash 模式 | GitHub Pages 不支持 HTML5 history 模式（无法配置 fallback），Hash 模式零配置可用 |
| 部署 | GitHub Pages + Actions | 免费静态托管，CI/CD 一键配置 |

### 不引入的技术

| 排除项 | 原因 |
|--------|------|
| SSR / Nuxt | 纯静态工具站无需服务端渲染 |
| 状态管理（Pinia） | 工具间无共享状态，本地 `ref/reactive` 足够 |
| 后端服务 | 所有工具均为纯客户端，无需服务器 |
| UI 组件库（Element/Ant） | 引入成本高，工具 UI 简单，Tailwind 手写更灵活 |

---

## 二、项目结构详解

```
usefull-tools/
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions 自动部署
├── docs/                          # 产品/架构/工具目录文档
│   ├── product-design.md
│   ├── technical-architecture.md
│   └── tools-catalog.md
├── public/
│   └── favicon.svg                # 网站图标
├── src/
│   ├── main.js                    # 应用入口，挂载 Vue + Router
│   ├── App.vue                    # 根组件（<router-view>）
│   │
│   ├── router/
│   │   └── index.js               # 路由表，所有路由懒加载
│   │
│   ├── data/
│   │   ├── tools.js               # 工具元数据注册中心（唯一数据源）
│   │   └── platformSizes.js       # 社交平台尺寸规范数据
│   │
│   ├── utils/                     # 纯函数工具库（无副作用）
│   │   ├── color.js               # 颜色相关：HEX↔RGB↔HSL转换、色阶生成、主色提取
│   │   ├── textStats.js           # 文本统计：字数/字符/段落/词频/可读性
│   │   └── units.js               # 单位换算数据表和换算函数
│   │
│   ├── composables/               # Vue Composition 函数（有响应式状态）
│   │   ├── useTimer.js            # 计时器（番茄钟+倒计时共用）
│   │   ├── useClipboard.js        # 复制到剪贴板 + Toast 提示
│   │   └── useLocalStorage.js     # 本地持久化（内容日历等工具用）
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue      # Logo + 搜索入口 + GitHub 链接
│   │   │   └── AppFooter.vue      # 版权信息
│   │   └── common/
│   │       ├── ToolCard.vue       # 首页工具卡片
│   │       ├── CategoryTabs.vue   # 分类 Tab（含激活态、移动端横滚）
│   │       ├── ToolLayout.vue     # 工具页统一外壳（面包屑+标题+描述插槽）
│   │       ├── CopyButton.vue     # 带 Toast 的复制按钮
│   │       └── EmptyState.vue     # 空状态（搜索无结果/分类无工具）
│   │
│   └── views/
│       ├── Home.vue               # 首页
│       └── tools/
│           ├── dev/               # 研发工具（15个）
│           │   ├── json-formatter.vue
│           │   ├── base64-codec.vue
│           │   ├── timestamp-converter.vue
│           │   ├── regex-tester.vue
│           │   ├── url-codec.vue
│           │   ├── cron-generator.vue
│           │   ├── color-converter.vue
│           │   ├── row-col-converter.vue
│           │   ├── uuid-generator.vue
│           │   ├── data-converter.vue
│           │   ├── case-converter.vue
│           │   ├── text-diff.vue
│           │   ├── html-escape.vue
│           │   ├── jwt-decoder.vue
│           │   └── http-status-codes.vue
│           ├── product/           # 产品工具（8个）
│           │   ├── ab-calculator.vue
│           │   ├── priority-matrix.vue
│           │   ├── user-story-generator.vue
│           │   ├── competitor-table.vue
│           │   ├── okr-assistant.vue
│           │   ├── product-roadmap.vue
│           │   ├── nps-calculator.vue
│           │   └── swot-analysis.vue
│           ├── ops/               # 运营工具（7个）
│           │   ├── utm-generator.vue
│           │   ├── roi-calculator.vue
│           │   ├── aarrr-funnel.vue
│           │   ├── text-analyzer.vue
│           │   ├── content-calendar.vue
│           │   ├── seo-preview.vue
│           │   └── social-sizes.vue
│           ├── design/            # 设计工具（8个）
│           │   ├── color-palette.vue
│           │   ├── gradient-generator.vue
│           │   ├── font-preview.vue
│           │   ├── design-sizes.vue
│           │   ├── icon-search.vue
│           │   ├── box-shadow-editor.vue
│           │   ├── css-unit-converter.vue
│           │   └── placeholder-image.vue
│           └── life/              # 生活工具（10个）
│               ├── qr-generator.vue
│               ├── password-generator.vue
│               ├── unit-converter.vue
│               ├── bmi-calculator.vue
│               ├── date-calculator.vue
│               ├── pomodoro-timer.vue
│               ├── countdown.vue
│               ├── age-calculator.vue
│               ├── text-counter.vue
│               └── color-extractor.vue
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 三、核心文件规范

### `src/data/tools.js` — 工具元数据

每个工具对象结构：

```js
{
  id: 'json-formatter',          // 唯一 ID，kebab-case，与路由末段一致
  name: 'JSON 格式化',            // 展示名称
  description: '在线美化、压缩、校验 JSON 数据',  // 卡片描述（≤30字）
  category: 'dev',               // dev | product | ops | design | life
  icon: 'mdi:code-json',         // Iconify 图标名
  route: '/tools/dev/json-formatter',  // 完整路由路径
  tags: ['JSON', '格式化', '开发'],    // 搜索标签
  status: 'online',              // online | coming-soon
}
```

**约定**：`tools.js` 是工具信息的**唯一数据源**。首页卡片、搜索、分类过滤全部从这里读取，不允许在其他地方硬编码工具信息。

### `src/router/index.js` — 路由

- 使用 `createWebHashHistory()`（Hash 模式，适配 GitHub Pages）
- 所有工具路由使用动态 `import()` 懒加载
- 路由路径格式：`/tools/{category}/{tool-id}`
- **路由从 `tools.js` 数据源自动生成**，新增工具只需在 `tools.js` 添加记录，无需手动维护路由数组

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import tools from '@/data/tools.js'

// 从 tools.js 元数据自动生成路由，无需每次手动添加
const toolRoutes = tools.map(tool => ({
  path: tool.route,
  component: () => import(/* @vite-ignore */ `@/views${tool.route}.vue`)
}))

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  ...toolRoutes,
  { path: '/:pathMatch(.*)*', redirect: '/' }  // 404 重定向首页
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
```

> ⚠️ 推荐写法：用 `import.meta.glob` 预加载所有工具组件，Vite 可静态分析并自动 code split：
>
> ```js
> // 工具文件统一 kebab-case 命名，与 tool.route 末段一致
> // route: '/tools/dev/json-formatter' → 文件: json-formatter.vue
> const modules = import.meta.glob('/src/views/tools/**/*.vue')
>
> const toolRoutes = tools.map(tool => ({
>   path: tool.route,
>   // tool.route = '/tools/dev/json-formatter'
>   // → key = '/src/views/tools/dev/json-formatter.vue'  ✓
>   component: modules[`/src/views${tool.route}.vue`]
> }))
> ```

### `src/components/common/ToolLayout.vue` — 工具页外壳

Props（JSDoc 注释风格，项目使用纯 JS，不引入 TypeScript）：
```js
/**
 * @prop {string} title       - 工具名称
 * @prop {string} description - 工具描述
 * @prop {string} [category]  - 分类名，用于面包屑（如「研发」）
 */
```

插槽：`default`（工具主体内容）

> **注意**：文档中所有类型标注均使用 JSDoc 风格（`@prop {string}`），不使用 TypeScript 语法，避免误导。如未来需要类型支持，可在不改变运行时的前提下加 `jsconfig.json` 启用 IDE 类型推断。

---

## 四、共享工具函数

### `src/utils/color.js`

| 函数 | 功能 | 使用工具 |
|------|------|----------|
| `hexToRgb(hex)` | HEX → RGB 对象 | 颜色格式转换、配色方案 |
| `rgbToHex(r,g,b)` | RGB → HEX | 颜色格式转换 |
| `rgbToHsl(r,g,b)` | RGB → HSL | 颜色格式转换 |
| `generatePalette(hex, steps)` | 主色 → 色阶数组 | 配色方案生成器 |
| `extractColors(imageData, count)` | Canvas ImageData → 主色列表 | 颜色提取器 |

### `src/utils/textStats.js`

| 函数 | 功能 | 使用工具 |
|------|------|----------|
| `countChars(text)` | 字符数（含/不含空格） | 文本统计分析器、文本统计 |
| `countWords(text)` | 中英文词数 | 同上 |
| `countLines(text)` | 行数 | 同上 |
| `countParagraphs(text)` | 段落数 | 同上 |
| `getKeywordFrequency(text, n)` | 高频词 Top N | 文本统计分析器 |

### `src/composables/useTimer.js`

```js
// 番茄钟和倒计时共用
const { remaining, isRunning, start, pause, reset } = useTimer(initialSeconds)
```

---

## 五、第三方依赖

| 依赖 | 版本 | 用途 | 使用工具 |
|------|------|------|----------|
| `qrcode` | latest | 生成二维码 | 二维码生成器 |
| `diff` | latest | 文本差异对比 | 文本 Diff 对比 |
| `js-yaml` | latest | YAML 解析/序列化 | JSON↔YAML互转 |
| `papaparse` | latest | CSV 解析/生成 | JSON↔CSV互转 |
| `@iconify/vue` | latest | 图标组件 | 全站图标 |
| `html2canvas` | latest | DOM 导出图片 | SWOT/产品路线图导出 |

所有依赖均为纯客户端库，无需服务端支持。

---

## 六、构建与部署

### vite.config.js 关键配置

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/usefull-tools/',          // GitHub Pages 子路径，必须与仓库名一致
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // 用函数形式自动按目录分 chunk，新增工具无需手动维护数组
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/views/tools/dev/')) return 'tools-dev'
          if (id.includes('/views/tools/product/')) return 'tools-product'
          if (id.includes('/views/tools/ops/')) return 'tools-ops'
          if (id.includes('/views/tools/design/')) return 'tools-design'
          if (id.includes('/views/tools/life/')) return 'tools-life'
        }
      }
    }
  }
})
```

### GitHub Actions 工作流（`.github/workflows/deploy.yml`）

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### tailwind.config.js — content 路径（必须正确配置）

```js
// tailwind.config.js
export default {
  // ⚠️ content 路径必须覆盖所有使用 Tailwind 类名的文件
  // 路径写错会导致构建产物包含全量 Tailwind CSS（未压缩约 3MB+）
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

> 验证方式：运行 `npm run build` 后查看 `dist/assets/` 中 CSS 文件大小。正常业务 CSS 应在 20–80 KB 之间；若超过 500 KB，说明 content 路径配置有误，Tailwind 未做 tree-shaking。

### 部署流程

```
本地 dev 分支开发
    ↓ PR 合并到 main
GitHub Actions 触发
    ↓ npm ci + npm run build
生成 dist/ 静态文件
    ↓ 推送到 gh-pages 分支
GitHub Pages 自动发布
    ↓
https://wellstang.github.io/usefull-tools/
```

---

## 七、性能优化策略

| 措施 | 实现方式 | 效果 |
|------|----------|------|
| 路由懒加载 | 所有工具页动态 import | 首屏只加载首页代码 |
| 按分类分 chunk | vite manualChunks | 避免单一大 bundle |
| 图标按需加载 | @iconify/vue 按需引入 | 不加载未使用图标 |
| Tailwind 树摇 | content 配置扫描 src/ | CSS 只含使用到的类 |
| 图片 Canvas 处理 | 颜色提取器等纯 Canvas | 无图片文件上传 |

---

## 八、扩展规范

### 文件命名约定

工具 `.vue` 文件统一使用 **kebab-case** 命名（与 `tools.js` 中的路由末段保持一致），这样 `import.meta.glob` 可以直接从路由路径映射到文件路径，无需额外字段：

```
route: '/tools/dev/json-formatter'
→ 文件：src/views/tools/dev/json-formatter.vue
→ glob key: /src/views/tools/dev/json-formatter.vue  ✓ 直接匹配
```

> 不使用 PascalCase（如 `JsonFormatter.vue`），避免路由路径与文件名不一致导致 `import.meta.glob` 映射失败。

### 新增一个工具（标准流程，2 步）

1. 在 `src/data/tools.js` 注册元数据（`status: 'wip'` 开发中不展示，完成后改为 `'online'`）
2. 在 `src/views/tools/{category}/` 创建对应的 kebab-case `.vue` 文件

路由由 `import.meta.glob` 自动生成，无需手动修改 `src/router/index.js`。

### 新增一个分类 Tab

1. 在 `src/data/tools.js` 的 category 字段新增值
2. 在 `CategoryTabs.vue` 的分类配置数组中添加
3. 在 `src/views/tools/` 下创建对应子目录

### Error Boundary — 工具崩溃隔离

48 个工具独立运行，任何一个工具的 JS 异常不应影响其他工具或首页。在 `ToolLayout.vue` 中使用 Vue 3 的 `onErrorCaptured` 捕获子组件错误：

```vue
<!-- ToolLayout.vue 内 -->
<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMsg = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMsg.value = err.message
  console.error('[ToolLayout] 工具运行异常:', err)
  return false  // 阻止向上传播
})
</script>

<template>
  <div v-if="hasError" class="error-state">
    工具出现了问题，请刷新页面重试。
  </div>
  <slot v-else />
</template>
```

### html2canvas 使用注意

`产品路线图` 和 `SWOT 分析模板` 使用 `html2canvas` 导出图片。该库对复杂 CSS 存在渲染差异，遵守以下约束：

- 导出区域的 DOM 只使用基础 CSS（背景色、字体、边框），不使用 `backdrop-filter`、`clip-path`、CSS 变量、`@font-face` 自定义字体
- 导出前检查 `html2canvas` 的 `useCORS: true` 选项，避免跨域图片导致空白
- 在浅色背景下测试导出效果，深色模式不纳入导出设计范围

### 后续可能引入后端的工具

若未来需要为汇率换算、行业情报等工具添加 API 代理，推荐使用 **Cloudflare Workers**（免费额度充足，部署在 CDN 边缘节点），不需要独立服务器。
