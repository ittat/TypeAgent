// export interface Role {
//   name: string;
//   state: string;
//   desc: string;
// }

// import exp from "constants";

// export interface Memory {
//   content: string;
//   role: string;
//   cause_by: string;
//   timestamp: string;
// }

export interface WorkflowJobState {
  uuid: string;
  status: "pending" | "processing" | "completed" | "failed";
  result?: any;
  error?: string;
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
  chatHistory?: BaseMessage[];
}

export interface BaseMessage {
  time: string;
  role: WorkflowRole;
  message: {
    kwargs: {
      content: string;
    };
    id?: string;
  };
}

/**
 * 工作流状态枚举
 */
export enum WorkflowStatus {
  Started = "started",
  Analyzing = "analyzing",
  Planning = "planning",
  Designing = "designing",
  Implementing = "implementing",
  Evaluating = "evaluating",
  InProgress = "in_progress",
  End = "end",
}

export enum WorkflowRole {
  Assistant = "assistant",
  ProductManager = "productManager",
  ProjectManager = "projectManager",
  Architect = "architect",
  Engineer = "engineer",
  Start = "start",
  End = "end",
  Unknown = "unknown",
  ProgressWatcher = "progressWatcher",
}

interface GraphState {
  messages: any[];
  state: ProjectState;
}

export interface WorkflowStateResponse {
  status: "queue" | "progress" | "complete" | "error";
  state?: ProjectState;
  message?: string;
}

export type WorkflowState = GraphState;

export enum TeamRole {
  ProductManager = "ProductManager",
  ProjectManager = "ProjectManager",
  Architect = "Architect",
  Engineer = "Engineer",
  // Anonymity,
}

interface Lan {
  en: string;
  zh: string;
}
export const TeamName: Record<TeamRole, Lan> = {
  [TeamRole.ProductManager]: {
    en: "Product Manager",
    zh: "产品经理",
  },
  [TeamRole.ProjectManager]: {
    en: "Project Manager",
    zh: "项目经理",
  },
  [TeamRole.Architect]: {
    en: "Architect",
    zh: "架构师",
  },
  [TeamRole.Engineer]: {
    en: "Engineer",
    zh: "工程师",
  },
  // [TeamRole.Anonymity]: {
  //   en: "Anonymous",
  //   zh: "匿名",
  // }
};

export const TeamRoleDesc: Record<TeamRole, Lan> = {
  [TeamRole.ProductManager]: {
    en: "",
    zh: "",
  },
  [TeamRole.ProjectManager]: {
    en: "",
    zh: "",
  },
  [TeamRole.Architect]: {
    en: "",
    zh: "",
  },
  [TeamRole.Engineer]: {
    en: "",
    zh: "",
  },
  // [TeamRole.Anonymity]: {
  //   en: "Anonymous",
  //   zh: "匿名",
  // }
};
