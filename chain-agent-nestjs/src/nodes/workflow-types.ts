/**
 * 工作流角色枚举
 */
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

