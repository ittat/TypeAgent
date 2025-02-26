# TypeAgent NestJS

基于NestJS框架的智能体系统实现，提供完整的多智能体协作框架，支持角色管理、动作系统、记忆系统和LLM集成。

## 🌟 核心特性

- 🤖 **多角色协作系统**：支持多个AI角色协同工作，每个角色具有独立的行为模式和记忆系统
- 🎯 **灵活的动作系统**：可自定义的动作定义和执行机制，支持复杂任务流程
- 🧠 **智能记忆管理**：集成短期和长期记忆系统，提供多维度的记忆检索能力
- 🔌 **LLM模型集成**：支持对接多种大语言模型，灵活切换和扩展

## 🚀 快速开始

### 环境准备

- Node.js >= 16
- pnpm >= 8

### 安装部署

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run start:dev
```

## 📖 使用指南

### 1. 需求分析

向系统提交需求，获取任务分析和执行计划：

```http
POST http://localhost:3000/assistant/analyze-requirement
Content-Type: application/json

{
    "content": "我需要一个在线商城系统，包含用户管理、商品管理、订单管理等基本功能"
}
```

### 2. 系统监控

#### 查看角色状态
```http
GET http://localhost:3000/assistant/roles
```

#### 查看记忆内容
```http
GET http://localhost:3000/assistant/memory
```

#### 记忆检索
- 按角色查询：`GET /assistant/memory?role=engineer`
- 按动作查询：`GET /assistant/memory?causeBy=WriteCodeAction`
- 查看最近记忆：`GET /assistant/memory?count=5`

## 🏗️ 项目结构

```
src/
├── actions/        # 动作系统实现
│   ├── write-code/   # 代码生成相关动作
│   ├── think/        # 思考和分析动作
│   └── review/       # 代码审查动作
├── assistant/      # 智能助手核心模块
├── llm/           # LLM模型集成接口
├── memory/        # 记忆系统实现
├── roles/         # 角色定义和管理
└── types/         # 类型定义
```

## 📚 API文档

### 需求分析接口

- **接口**：`POST /assistant/analyze-requirement`
- **功能**：分析用户需求并生成任务计划
- **参数**：
  ```json
  {
    "content": "需求描述文本"
  }
  ```

### 角色管理接口

- **接口**：`GET /assistant/roles`
- **功能**：获取所有角色状态信息
- **返回**：当前系统中所有角色的状态列表

### 记忆查询接口

- **接口**：`GET /assistant/memory`
- **功能**：查询系统记忆内容
- **参数**：
  - `role`: 按角色筛选
  - `causeBy`: 按触发动作筛选
  - `count`: 返回记录数量限制

## 🤝 参与贡献

欢迎参与项目改进！在提交代码前，请确保：

1. 遵循项目编码规范
2. 编写必要的测试用例
3. 更新相关文档
4. 提交有意义的commit信息

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。
