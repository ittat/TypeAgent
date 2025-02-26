import { Injectable, Logger } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { RoleName } from 'src/types/role-type';
import { ActionType } from 'src/types/action-type';

const getAnylyzeProjectStage = (messages: Message[]): string => {
    const history = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    const stage = ["需求分析", "设计", "开发"].map(k => k).join(" | ");
    const nextHandler = Object.keys(RoleName).map(k => RoleName[k]).join(" | ");
    const priority = ["高", "中", "低"].map(k => k).join(" | ");

    return `
一个完整的项目开发流程包含以下阶段：

1. 需求分析阶段
- 负责人：${RoleName.ProductManager}
- 主要任务：需求收集、用户故事、功能列表、验收标准
- 完成标志：PRD文档完成并通过评审

2. 系统设计阶段
- 负责人：${RoleName.Architect}
- 主要任务：系统架构、技术选型、接口设计、数据模型
- 完成标志：架构设计文档完成并通过评审

3. 细节设计阶段
- 负责人：${RoleName.ProjectManager}
- 主要任务：任务分解、工作量评估、开发计划、依赖分析
- 完成标志：任务列表完成并分配到位

4. 代码开发阶段
- 负责人：${RoleName.Engineer}
- 主要任务：功能实现、单元测试、代码审查
- 完成标志：功能完成并通过测试

5. 项目完成
- 移交给：${RoleName.Human}
- 完成标志：所有功能开发完成

作为项目的任务调度员，请分析以下消息历史，判断项目当前所处的阶段并确定下一步骤的最佳处理者。

优先级判断标准：
- 高：阻塞其他任务的关键路径任务
- 中：重要但不紧急的常规任务
- 低：可选或优化性质的任务

请提供以下JSON格式的分析结果：
{
  "currentStage": "${stage}",  // 当前项目阶段
  "progress": 0-100,  // 当前阶段完成度
  "nextHandler": "${nextHandler}",  // 下一步处理者角色
  "taskDescription": "任务描述",  // 具体任务内容
  "priority": "${priority}",  // 任务优先级
  "isDone": false  // 项目是否完成
}

注意事项：
1. 当检测到消息历史中出现循环往复的情况时，将isDone设为true终止项目
2. 当消息历史长度超过10条时，将isDone设为true终止项目
3. 确保nextHandler的角色分配符合各阶段的职责定义
4. 优先级评估需要考虑任务的依赖关系和关键程度

消息历史：
\`\`\`json
${JSON.stringify(messages, null, 2)}
\`\`\`
`;
};

export interface TaskAnalysisResult {
  currentStage: string;
  progress: number;
  nextHandler: RoleName;
  taskDescription: string;
  priority: string;
  isDone: boolean;
}

@Injectable()
export class TaskDispatcherAction extends Action {
  static ACTION_NAME: ActionType = ActionType.TASK_DISPATCHER;
  private readonly logger = new Logger(TaskDispatcherAction.name);
  protected name = ActionType.TASK_DISPATCHER;

  constructor(llm: LLMProvider) {
    super(llm);
  }

  async run(messages: Message[]) {
    this.logger.log('Analyzing project stage and determining next handler...');
    
    // 生成分析提示
    const prompt = getAnylyzeProjectStage(messages);
    
    // 使用LLM分析项目阶段
    const response = await this.llm.ask(prompt);

// response 例子：
// ```json
// {
//   "currentStage": "需求分析",
//   "progress": 10,
//   "nextHandler": "ProductManager",
//   "taskDescription": "与提出需求的人员沟通，详细了解商城系统的具体需求，例如：用户角色（买家/卖家/管理员）、商品分类、支付方式、物流方式、订单流程等。",
//   "priority": "高"
// }
// ```
 
    
    try {
     
      // 使用正则表达式，将response的```json开头和```结尾去除
      const jsonStr  = response.replace(/^```json/, '').replace(/```/, '');
      this.logger.log(`LLM response: ${jsonStr}`);

      // 解析LLM返回的JSON结果
      const result: TaskAnalysisResult = JSON.parse(jsonStr);
      
      this.logger.log(`Analysis result - Stage: ${result.currentStage}, Progress: ${result.progress}%, Next Handler: ${result.nextHandler}`);
  

      return JSON.stringify(result);
    } catch (error) {
      this.logger.error('Failed to parse LLM response', error);
      // throw new Error('Failed to analyze project stage');
      return null;
    }
  }
}