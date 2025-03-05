import { BaseMessage, MessageContent } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";

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

/**
 * 工作流状态接口，定义了节点间传递的状态数据结构
 */
export interface ProjectState {
  // 项目唯一标识
  uuid?: string;
  // 输入需求
  requirement?: string;
  // 项目名称
  projectName?: string;
  // 项目描述
  projectDesc?: string;
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
  // 沟通记录
  chatHistory?: {
    time: Date;
    role: WorkflowRole;
    message: BaseMessage;
  }[];
}


const GraphState = Annotation.Root({
  // messages: Annotation<BaseMessage[]>({
  //   reducer: (x, y) => x.concat(y),
  //   default: () => [],
  // }),
  state: Annotation<ProjectState>({
    reducer:  (x, y) =>  ( { ...x, ...y }) ,
    default: () => ({
      uuid: '',
      status: WorkflowStatus.Started,
      currentRole: WorkflowRole.Start,
      requirement: '',
      projectName: '',
      productDoc: undefined,
      techDoc: undefined,
      planDoc: undefined,
      codeDoc: undefined,
    }),
  }),
})

export type WorkflowState =   typeof GraphState.State