import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from '../llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WriteTasksAction extends Action {
  static ACTION_NAME: ActionType = ActionType.WRITE_TASKS
  protected name = ActionType.WRITE_TASKS;
  protected desc = '根据系统设计方案分解和管理任务，包括任务创建、优先级设置和依赖关系管理';

  constructor(llm: LLMProvider) {
    super(llm);
  }

  private taskPromptTemplate = `
作为项目经理，请根据以下系统设计方案分解任务：
{design}

请提供以下内容：
1. 任务分解列表，包括：
   - 任务名称
   - 任务描述
   - 优先级（高/中/低）
   - 预估工时
   - 依赖关系

2. 任务实施建议：
   - 建议的任务执行顺序
   - 关键路径分析
   - 风险点识别

请确保任务分解合理，覆盖所有功能点，并考虑技术依赖关系。
`;

  async run(design: Message[]): Promise<string> {
    // 将Message数组转换为字符串
    const designText = design.map(msg => msg.content).join('\n');
    const prompt = this.taskPromptTemplate.replace('{design}', designText);
    const tasks = await this.llm.ask(prompt);
    return tasks;
  }
}