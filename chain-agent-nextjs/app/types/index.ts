// export interface Role {
//   name: string;
//   state: string;
//   desc: string;
// }

// export interface Memory {
//   content: string;
//   role: string;
//   cause_by: string;
//   timestamp: string;
// }

export interface WorkflowJobState {
  uuid: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

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
  // 下一步执行角色
  nextRole?: WorkflowRole;
}

/**
 * 工作流状态枚举
 */
export enum WorkflowStatus {
  Started = 'started',
  Analyzing = 'analyzing',
  Planning = 'planning',
  Designing = 'designing',
  Implementing = 'implementing',
  Evaluating = 'evaluating',
  InProgress = 'in_progress',
  End = 'end',
}


export enum WorkflowRole {
  Assistant = 'assistant',
  ProductManager = 'productManager',
  ProjectManager = 'projectManager',
  Architect = 'architect',
  Engineer = 'engineer',
  Start = 'start',
  End = 'end',
  Unknown = 'unknown',
  ProgressWatcher = 'progressWatcher',
}


interface GraphState {
  messages: any[],
  state: ProjectState,
}

export type WorkflowState =  GraphState
