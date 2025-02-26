# TypeAgent NextJS

基于Next.js框架的智能体系统前端实现，提供完整的多智能体可视化交互界面，支持实时对话、任务管理、记忆可视化等功能。

## 🌟 核心特性

- 🎨 **现代化UI设计**：采用最新的Next.js 13+框架，结合Tailwind CSS打造美观易用的用户界面
- 💬 **实时对话系统**：支持与多个AI角色进行实时对话交互
- 📊 **可视化任务管理**：直观展示任务执行状态和进度
- 🔍 **记忆系统可视化**：以图表方式展示AI角色的记忆网络
- 🔄 **与后端无缝集成**：完美对接TypeAgent NestJS后端服务

## 🚀 快速开始

### 环境准备

- Node.js >= 16
- pnpm >= 8

### 安装部署

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm run start
```

## 📖 使用指南

### 1. 配置后端服务

在`.env`文件中配置后端服务地址：

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. 页面说明

- `/` - 首页，展示系统概览和快速入口
- `/team` - 团队页面，展示AI角色组成和状态
- `/chat` - 对话页面，支持与AI角色实时交互
- `/tasks` - 任务管理页面，展示任务列表和执行状态
- `/memory` - 记忆可视化页面，展示AI角色的记忆网络

## 🏗️ 项目结构

```
app/
├── components/     # 可复用组件
│   ├── chat/      # 对话相关组件
│   ├── memory/    # 记忆可视化组件
│   └── team/      # 团队相关组件
├── services/      # API服务封装
│   ├── api.ts     # API基础配置
│   └── types.ts   # API类型定义
├── types/         # 全局类型定义
├── utils/         # 工具函数
├── hooks/         # 自定义Hooks
└── pages/         # 页面组件
    ├── index.tsx  # 首页
    ├── team/      # 团队页面
    ├── chat/      # 对话页面
    └── memory/    # 记忆页面
```

## 📚 API集成

### 对话接口

```typescript
// 发送消息
const sendMessage = async (content: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ content })
  });
  return response.json();
};

// 获取对话历史
const getHistory = async () => {
  const response = await fetch('/api/chat/history');
  return response.json();
};
```

### 任务管理接口

```typescript
// 获取任务列表
const getTasks = async () => {
  const response = await fetch('/api/tasks');
  return response.json();
};

// 更新任务状态
const updateTask = async (taskId: string, status: TaskStatus) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
  return response.json();
};
```

## 🎨 UI组件

项目使用Tailwind CSS进行样式管理，主要组件包括：

- `ChatWindow` - 对话窗口组件
- `TeamCard` - 团队成员卡片
- `MemoryGraph` - 记忆网络图表
- `TaskList` - 任务列表组件

## 🤝 参与贡献

欢迎参与项目改进！在提交代码前，请确保：

1. 遵循项目编码规范
2. 编写必要的测试用例
3. 更新相关文档
4. 提交有意义的commit信息

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。