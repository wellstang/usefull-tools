# 唐唐工具箱

> 一站式实用工具集合，趁手好用，提升工作效率

**线上访问**：https://wellstang.github.io/usefull-tools/

---

## 特点

- **48 个实用工具**，覆盖产品、运营、研发、设计、生活五大场景
- **纯客户端运行**，所有数据在浏览器本地处理，零上传，保护隐私
- **无需登录**，打开即用
- **响应式设计**，完美适配 PC 和手机
- **完全开源免费**

---

## 工具分类

| 分类 | 工具数 | 代表工具 |
|------|--------|----------|
| 研发 | 15 | JSON格式化 · Base64 · 时间戳 · 正则测试 · JWT解码 · 文本Diff · HTTP状态码 |
| 产品 | 8  | AB实验样本量 · 需求优先级矩阵 · OKR助手 · NPS计算 |
| 运营 | 7  | UTM生成器 · AARRR漏斗 · SEO预览 · 文本统计分析 |
| 设计 | 8  | 配色方案 · 渐变色生成 · Box Shadow编辑器 · CSS单位换算 |
| 生活 | 10 | 二维码生成 · 密码生成 · 番茄钟 · 颜色提取器 · 年龄计算 |

完整工具列表见 [docs/tools-catalog.md](docs/tools-catalog.md)。

---

## 本地运行

```bash
# 克隆仓库
git clone https://github.com/wellstang/usefull-tools.git
cd usefull-tools

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

---

## 技术栈

- **框架**：[Vite 5](https://vitejs.dev/) + [Vue 3](https://vuejs.org/)（Composition API）
- **样式**：[Tailwind CSS 3](https://tailwindcss.com/)
- **路由**：[Vue Router 4](https://router.vuejs.org/)（Hash 模式）
- **图标**：[Iconify](https://iconify.design/)
- **部署**：GitHub Pages（GitHub Actions 自动构建）

---

## 开发文档

- [产品设计文档](docs/product-design.md) — 产品定位、用户画像、交互规范
- [技术架构文档](docs/technical-architecture.md) — 技术栈、项目结构、部署方案
- [工具目录](docs/tools-catalog.md) — 47 个工具详细说明
- [开发说明](CLAUDE.md) — 开发规范、新增工具流程

---

## 贡献

欢迎提 Issue 或 PR！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/new-tool`
3. 参考 [CLAUDE.md](CLAUDE.md) 中的「新增工具规范」完成开发
4. 提交 PR 到 `dev` 分支

---

## License

[MIT](LICENSE) © 2026 369491785@qq.com
