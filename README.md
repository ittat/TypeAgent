# Type Agent

基于 LLM 的智能开发助手，通过自然语言交互实现需求分析、架构设计和代码生成。

## 主要功能

### 1. 智能对话
- 基于大语言模型的自然语言交互
- 上下文理解和多轮对话支持
- 专业领域知识问答

### 2. 文档管理
- 自动生成产品需求文档
- 技术架构设计文档
- 项目开发计划书

### 3. 代码生成
- 根据需求自动生成代码
- 代码优化和重构建议
- 多语言和框架支持

## 技术架构

### 前端 (NextJS)
- React 18 + TypeScript
- TailwindCSS 样式方案
- 组件化开发

### 后端 (NestJS)
- Node.js + TypeScript
- LangChain 框架集成
- RESTful API 设计

## 效果展示

### 代码生成
![代码生成](/images/shot3.png)

### 智能对话界面
![对话界面](/images/shot1.png)

### 文档管理
![文档管理](/images/shot2.png)

### 项目代码生成
![项目概览](/images/shot4.png)

## 快速开始

### 前端启动
```bash
cd chain-agent-nextjs
pnpm install
pnpm dev
```

### 后端启动
```bash
cd chain-agent-nestjs
pnpm install
pnpm start:dev
```


## 技术支持

如有问题或建议，欢迎提交 Issue 或 Pull Request