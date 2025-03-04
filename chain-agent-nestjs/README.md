# Chain Agent NestJS

基于NestJS框架实现的智能体工作流系统，通过多个专业角色智能体的协作和队列管理，实现复杂任务的自动化处理和代码生成。

## 🌟 系统架构

项目主要由以下核心模块组成：

- **工作流系统**：管理和协调多个智能体节点的协作流程
  - 任务队列管理：使用BullMQ实现任务的异步处理和状态追踪
  - 工作流编排：智能协调各个角色节点的工作流程
  - 状态监控：实时监控任务执行状态和进度

- **智能体节点**：包含多个专业角色的AI智能体
  - 产品经理：需求分析和功能规划
  - 架构师：系统设计和技术选型
  - 工程师：代码实现和优化
  - 项目经理：任务管理和进度控制
  - 进度监控：监控任务执行状态

- **LLM集成**：支持对接不同的大语言模型

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Redis >= 6.0 (用于任务队列)

### 安装部署

1. 克隆项目并安装依赖
```bash
pnpm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，配置以下环境变量：
# - RADIS_HOST：Redis服务器地址
# - RADIS_PORT：Redis服务器端口
# - LLM相关配置
```

3. 启动服务
```bash
pnpm run start:dev
```

## 📖 使用指南

### 启动工作流

向系统提交需求，启动智能体工作流：

```http
POST http://localhost:4399/workflow/start
Content-Type: application/json

{
    "requirement": "实现一个在线商城系统"
}
```

响应示例：
```json
{
    "status": "success",
    "uuid": "task-uuid",
    "message": "工作流任务已添加到队列"
}
```

### 查询任务状态

```http
GET http://localhost:4399/workflow/status/{uuid}
```

响应示例：
```json
{
    "status": "success",
    "state": {
        "uuid": "task-uuid",
        "status": "processing",
        "result": null
    }
}
```

### 查看队列状态

```http
GET http://localhost:4399/workflow/queue-status
```

响应示例：
```json
{
    "status": "success",
    "data": {
        "waiting": 2,
        "active": 1,
        "completed": 5,
        "failed": 0,
        "delayed": 0
    }
}
```

## 🔧 核心功能

### 工作流管理

- 智能任务分解和规划
- 多智能体协同工作
- 任务队列管理和状态追踪
- 并发任务处理

### 智能体系统

- **产品经理(ProductManager)**：分析用户需求，制定产品方案
- **架构师(Architect)**：负责系统设计和技术选型
- **工程师(Engineer)**：实现具体的代码功能
- **项目经理(ProjectManager)**：协调任务进度和资源分配
- **进度监控(ProgressWatcher)**：监控工作流程的执行状态

### 队列管理

- 基于BullMQ的可靠队列系统
- 支持任务重试和错误处理
- 实时任务状态更新
- 队列性能监控

### LLM集成

- 支持多种LLM模型接入
- 灵活的模型调用策略
- 统一的API接口封装

## 📚 API文档

### 工作流接口

#### 启动工作流
- **接口**：`POST /workflow/start`
- **功能**：提交需求并启动智能体工作流
- **请求参数**：
  ```json
  {
    "requirement": "需求描述文本"
  }
  ```
- **响应格式**：
  ```json
  {
    "status": "success",
    "uuid": "任务ID",
    "message": "工作流任务已添加到队列"
  }
  ```

#### 查询任务状态
- **接口**：`GET /workflow/status/{uuid}`
- **功能**：查询指定任务的执行状态
- **响应格式**：
  ```json
  {
    "status": "success",
    "state": {
      "uuid": "任务ID",
      "status": "任务状态",
      "result": "执行结果",
      "error": "错误信息（如果有）"
    }
  }
  ```

#### 查看队列状态
- **接口**：`GET /workflow/queue-status`
- **功能**：查看任务队列的整体状态
- **响应格式**：
  ```json
  {
    "status": "success",
    "data": {
      "waiting": "等待中的任务数",
      "active": "执行中的任务数",
      "completed": "已完成的任务数",
      "failed": "失败的任务数",
      "delayed": "延迟执行的任务数"
    }
  }
  ```

## 🤝 贡献指南

欢迎提交Issue和Pull Request，一起完善项目。在提交代码前，请确保：

1. 代码符合项目的编码规范
2. 添加必要的测试用例
3. 更新相关文档

## 📄 许可证

[MIT License](LICENSE)