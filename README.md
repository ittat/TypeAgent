# TypeAgent

TypeAgent 是一个基于大语言模型的智能体系统，由 NestJS 后端服务和 Next.js 前端界面组成，提供完整的多智能体协作和可视化交互能力。

## 🌟 系统架构

项目由两个主要部分组成：

- **TypeAgent NestJS**：后端服务，实现智能体核心逻辑
  - 多角色协作系统
  - 灵活的动作系统
  - 智能记忆管理
  - LLM模型集成

- **TypeAgent NextJS**：前端界面，提供可视化交互
  - 现代化UI设计
  - 实时对话系统
  - 可视化任务管理
  - 记忆系统可视化

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 安装部署

1. 克隆项目
```bash
git clone https://github.com/yourusername/type-agent.git
cd type-agent
```

2. 安装后端依赖并启动
```bash
cd type-agent-nestjs
pnpm install
pnpm run start:dev
```

3. 安装前端依赖并启动
```bash
cd ../type-agent-nextjs
pnpm install
pnpm run dev
```

4. 访问系统
- 后端服务：http://localhost:3000
- 前端界面：http://localhost:3001

## 📖 项目结构

```
type-agent/
├── type-agent-nestjs/     # 后端服务
│   ├── src/
│   │   ├── actions/       # 动作系统实现
│   │   ├── assistant/     # 智能助手核心
│   │   ├── llm/          # LLM模型集成
│   │   ├── memory/       # 记忆系统
│   │   ├── roles/        # 角色定义
│   │   └── system/       # 系统服务
│   └── README.md         # 后端文档
│
└── type-agent-nextjs/    # 前端界面
    ├── app/
    │   ├── components/   # UI组件
    │   ├── services/     # API封装
    │   └── pages/        # 页面组件
    └── README.md         # 前端文档
```

## 🔧 配置说明

### 后端配置

在 `type-agent-nestjs/.env` 文件中配置：

```env
PORT=3000
LLM_API_KEY=your_api_key
```

### 前端配置

在 `type-agent-nextjs/.env` 文件中配置：

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📚 功能特性

- **多角色协作**：支持产品经理、架构师、工程师等多个AI角色协同工作
- **智能任务管理**：自动分配和追踪任务执行状态
- **记忆系统**：智能体具备短期和长期记忆能力
- **实时对话**：支持与多个AI角色实时交互
- **可视化界面**：直观展示系统运行状态和智能体行为

## 🤝 参与贡献

欢迎参与项目改进！在提交代码前，请确保：

1. 遵循项目编码规范
2. 编写必要的测试用例
3. 更新相关文档
4. 提交有意义的commit信息

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。