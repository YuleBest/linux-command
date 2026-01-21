# Linux 命令助手

基于 Vue 3 和 Vuetify 3 开发的现代化 Linux 命令查询工具

## ✨ 特性

- **智能搜索**：基于 Fuse.js 的模糊搜索，支持按命令名称和描述进行快速检索。
- **智能查询**：支持粘贴一段 Shell 脚本或命令，自动识别并提取其中的工具命令。
- **现代化 UI**：采用 Vuetify 3 构建，界面整洁、响应式，适配各种屏幕尺寸。

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 🛠️ 技术栈

- **命令文档来源**：[jaywcjlove/linux-command](https://github.com/jaywcjlove/linux-command)
- **框架**：[Vue 3](https://vuejs.org/) (Composition API)
- **UI 组件库**：[Vuetify 3](https://vuetifyjs.com/)
- **Markdown 渲染**：[Marked](https://marked.js.org/) + [Highlight.js](https://highlightjs.org/) (语法高亮)
- **编译工具**：[Vite](https://vitejs.dev/)
- **字体**：Google Sans & JetBrains Mono

## 📂 项目结构

- `src/pages/`：页面文件，按目录结构自动生成路由。
- `src/composables/`：通用的 Composition API 逻辑。
- `public/linux-command/command/`：存放所有命令的 Markdown 源文件。
- `scripts/`：包含索引生成等维护脚本。

## 📝 索引维护

项目使用 `scripts/generate-index.cjs` 自动生成命令索引。每当 Markdown 文件发生变化时，运行以下命令更新索引：

```bash
pnpm run generate:index
```

此外，索引生成已集成到 `dev` 和 `build` 的预处理阶段，通常无需手动运行。

## 📄 开源协议

MIT License
