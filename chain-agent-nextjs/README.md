# Chain Agent NextJS

## 项目介绍
Chain Agent NextJS 是一个基于 Next.js 框架开发的智能项目管理平台，它通过 AI 驱动的团队协作方式，帮助用户快速将创意转化为可执行的项目方案。

## 主要特性
- 🤖 AI 驱动的项目分析和规划
- 📝 自动生成项目文档（产品文档、技术文档、开发计划）
- 💻 智能代码生成和管理
- 👥 多角色协作（产品经理、项目经理、架构师、工程师）
- 🔄 实时项目状态追踪
- 📊 可视化项目展示

## 技术栈
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- React Markdown
- SWR

## 快速开始

### 环境要求
- Node.js 16.8+
- pnpm 8.0+

### 安装依赖
```bash
pnpm install
```

### 开发环境运行
```bash
pnpm dev
```

### 生产环境构建
```bash
pnpm build
pnpm start
```

## 项目结构
```
app/
├── globals.css        # 全局样式
├── layout.tsx         # 全局布局
├── page.tsx           # 首页
├── project/           # 项目相关页面
├── services/          # API 服务
└── types/             # 类型定义

components/
├── editor/           # 编辑器组件
└── ui/               # UI 组件

hooks/               # 自定义 Hooks
public/              # 静态资源
```

## 主要功能

### 1. 项目创建
- 通过自然语言输入需求
- AI 自动分析并规划项目

### 2. 文档管理
- 自动生成产品需求文档
- 技术架构设计文档
- 项目开发计划书

### 3. 代码管理
- 智能代码生成
- 在线代码预览
- 代码打包下载

### 4. 团队协作
- 多角色协作模式
- 实时沟通对话
- 项目进度追踪

## 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证
MIT License