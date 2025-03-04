import { Injectable } from '@nestjs/common';
import { START, END, StateGraph, CompiledStateGraph } from '@langchain/langgraph';
import { AssistantNode } from '../nodes/assistant.node';
import { ProductManagerNode } from '../nodes/product-manager.node';
import { ArchitectNode } from '../nodes/architect.node';
import { EngineerNode } from '../nodes/engineer.node';
import { ProgressWatcherNode } from '../nodes/progress-watcher.node';
import { ProjectState, WorkflowRole, WorkflowStatus } from '../types/workflow.types';


import { Annotation } from "@langchain/langgraph";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { convertMessageContentToString } from 'src/utils';
import { ProjectManagerNode } from 'src/nodes/project-manager.node';

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  state: Annotation<ProjectState>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({
      status: WorkflowStatus.Started,
      currentRole: WorkflowRole.Start,
      requirement: '',
      productDoc: undefined,
      techDoc: undefined,
      planDoc: undefined,
      codeDoc: undefined,
    }),
  }),
})

export type WorkflowState=   typeof GraphState.State

/**
 * 工作流管理器服务，负责创建和管理工作流图
 */
@Injectable()
export class WorkflowManagerService {
  private workflow: CompiledStateGraph<WorkflowState, string, string>; // StateGraph实例

  constructor(
    private readonly assistantNode: AssistantNode,
    private readonly productManagerNode: ProductManagerNode,
    private readonly architectNode: ArchitectNode,
    private readonly projectManagerNode: ProjectManagerNode,
    private readonly engineerNode: EngineerNode,
    private readonly progressWatcherNode: ProgressWatcherNode,
  ) {
    this.initializeWorkflow();
  }

  /**
   * 初始化工作流图，设置节点和边
   */
  private initializeWorkflow() {
    // 创建状态图，明确指定泛型参数和配置
    const workflow = new StateGraph<
      any,
      string,
      string,
      WorkflowRole
    >(GraphState);

    // 添加节点
    workflow.addNode(WorkflowRole.Assistant, this.processAssistant.bind(this));
    workflow.addNode(WorkflowRole.ProductManager, this.processProductManager.bind(this));
    workflow.addNode(WorkflowRole.Architect, this.processArchitect.bind(this));
    workflow.addNode(WorkflowRole.ProjectManager, this.processProject.bind(this));
    workflow.addNode(WorkflowRole.Engineer, this.processEngineer.bind(this));
    workflow.addNode(WorkflowRole.ProgressWatcher, this.processProgressWatcher.bind(this));

    // 设置边和流转逻辑
    workflow.addEdge(START, WorkflowRole.Assistant);
    workflow.addEdge(WorkflowRole.Assistant, WorkflowRole.ProgressWatcher);
    workflow.addEdge(WorkflowRole.ProductManager, WorkflowRole.ProgressWatcher);
    workflow.addEdge(WorkflowRole.Architect, WorkflowRole.ProgressWatcher);
    workflow.addEdge(WorkflowRole.ProjectManager, WorkflowRole.ProgressWatcher);
    workflow.addEdge(WorkflowRole.Engineer, WorkflowRole.ProgressWatcher);

    // 从进度监控节点根据评估结果决定下一步
    workflow.addConditionalEdges(
      WorkflowRole.ProgressWatcher,
      this.routeNextStep.bind(this),
      {
        [WorkflowRole.Assistant]: WorkflowRole.Assistant,
        [WorkflowRole.ProductManager]: WorkflowRole.ProductManager,
        [WorkflowRole.Architect]: WorkflowRole.Architect,
        [WorkflowRole.ProjectManager]: WorkflowRole.ProjectManager,
        [WorkflowRole.Engineer]: WorkflowRole.Engineer,
        [WorkflowRole.End]: END
      }
    );

    // 编译工作流
    // @ts-ignore
    this.workflow = workflow.compile();
  }

  /**
   * 启动工作流
   * @param requirement 用户需求
   * @returns 工作流执行结果
   */
  async runWorkflow(requirement: string) {
    // 初始状态
    const initialState: WorkflowState = {
      state: {
        status: WorkflowStatus.Started,
        currentRole: WorkflowRole.Start,
        requirement: requirement,
        productDoc: undefined,
        techDoc: undefined,
        planDoc: undefined,
        codeDoc: undefined,
      },
      messages: [
        new HumanMessage(requirement),
      ],
    };

    // 执行工作流
    const result = await this.workflow.invoke(initialState);
    return result;
  }

  /**
   * 处理需求分析节点
   */
  private async processAssistant(context: WorkflowState): Promise<WorkflowState> {
    const requirement = context.state.requirement;
    if (!requirement) {
      throw new Error('需求不能为空');
    }

    const ai_messages = await this.assistantNode.process(requirement);
    return {
      messages: [
        ai_messages
      ],
      state:{
          currentRole: WorkflowRole.Assistant,
          status: WorkflowStatus.Analyzing,
          productDoc:convertMessageContentToString(ai_messages.content)
      }
    };
  }

  /**
   * 处理产品经理节点
   */
  private async processProductManager(context: WorkflowState): Promise<WorkflowState> {
    const requirement = context.state.requirement;
    if (!requirement) {
      throw new Error('需求不能为空');
    }

    const ai_message = await this.productManagerNode.process(requirement);
    return {
      messages:[
        ai_message
      ],
      state:{
        productDoc: convertMessageContentToString(ai_message.content),
        currentRole: WorkflowRole.ProductManager,
        status: WorkflowStatus.Planning,
      }
    };
  }

  /**
   * 处理架构师节点
   */
  private async processArchitect(context: WorkflowState): Promise<WorkflowState> {
    const productDoc = context.state.productDoc;
    if (!productDoc) {
      throw new Error('产品文档不能为空');
    }

    const ai_message = await this.architectNode.process(productDoc.toString());
    return {
      messages:[
        ai_message
      ],
      state:{
        techDoc: convertMessageContentToString(ai_message.content),
        currentRole: WorkflowRole.Architect,
        status: WorkflowStatus.Designing,
      }

    };
  }

  /**
   * 处理项目规划节点
   */
  private async processProject(context: WorkflowState): Promise<WorkflowState> {
    const { techDoc, productDoc } = context.state;
    if (!techDoc || !productDoc) {
      throw new Error('技术文档或产品文档不能为空');
    }

    const ai_message = await this.projectManagerNode.process(techDoc.toString(), productDoc.toString());
    return {
      messages:[
        ai_message
      ],
      state:{
        planDoc: convertMessageContentToString(ai_message.content),
        currentRole: WorkflowRole.Architect,
        status: WorkflowStatus.Designing,
      }
    };
  }

  /**
   * 处理工程师节点
   */
  private async processEngineer(context: WorkflowState): Promise<WorkflowState> {
    const { techDoc, productDoc, planDoc } = context.state;
    if (!techDoc || !productDoc || !planDoc) {
      throw new Error('技术文档、产品文档或规划文档不能为空');
    }

    const response = await this.engineerNode.process(techDoc, productDoc, planDoc);
    return {
      messages:[
        response.ai_message
      ],
      state:{
        codeDoc: response.codeDoc,
        currentRole: WorkflowRole.Engineer,
        status: WorkflowStatus.Implementing,
      }

    };
  }

  /**
   * 处理进度监控节点
   */
  private async processProgressWatcher(context: WorkflowState): Promise<WorkflowState> {
    const state = context.state;

    console.log('开始进度监控');
    // console.log(state);

    // 进行进度评估
    const progressReport = await this.progressWatcherNode.process(state);

    return {
      messages:[
        progressReport
      ],
      state:{
        nextRole: convertMessageContentToString(progressReport.content).replace("\n","") as WorkflowRole,
        status: WorkflowStatus.Evaluating,
      }
    };
  }

  /**
   * 根据进度监控结果决定下一步
   */
  private routeNextStep(context: WorkflowState): WorkflowRole {
    const { nextRole, currentRole } = context.state;
    
    // 如果没有进度报告，返回结束
    if (!nextRole) {
      return WorkflowRole.End;
    }

        // 如果已经完成所有步骤或无法确定下一步，结束工作流
        if (currentRole === WorkflowRole.Engineer && context.state.codeDoc) {
          return WorkflowRole.End;
        }

    // 解析进度报告，确定下一步执行者    
    const roles = Object.values(WorkflowRole);
    if(nextRole && roles.includes(nextRole)){
      return  nextRole as WorkflowRole;
    }


    
    // 默认情况，根据当前角色决定下一步
    // 这是一个备选的线性流程，以防进度报告解析失败
    switch (currentRole) {
      case WorkflowRole.Assistant:
        return WorkflowRole.ProductManager;
      case WorkflowRole.ProductManager:
        return WorkflowRole.Architect;
      case WorkflowRole.Architect:
        return WorkflowRole.ProjectManager;
      case WorkflowRole.ProjectManager:
        return WorkflowRole.Engineer;
      case WorkflowRole.Engineer:
        return WorkflowRole.End;
      default:
        return WorkflowRole.End;
    }
  }
}