import { MessageContent } from "@langchain/core/messages";
import { WorkflowRole, WorkflowStatus } from "./workflow-types";

/**
 * 工作流状态接口，定义了节点间传递的状态数据结构
 */
export interface ProjectState {
  // 输入需求
  requirement?: string;
  // 产品文档
  productDoc?: string;
  // 技术架构文档
  techDoc?: string;
  // 项目规划文档
  planDoc?: string;
  // 代码实现文档
  codeDoc?: Record<string, string>;
  // 当前执行角色
  currentRole?: WorkflowRole;
  // 项目状态
  status?: WorkflowStatus;
  // 进度报告
  // progressReport?: string;
  // 下一步执行角色
  nextRole?: WorkflowRole;
}