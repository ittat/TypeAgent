import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WriteCodePlanAndChangeAction extends Action {
  static ACTION_NAME: ActionType = ActionType.WRITE_PLAN_AND_CHANGELOG;
  protected name = ActionType.WRITE_PLAN_AND_CHANGELOG;
  protected desc = 'Plan and document code changes based on requirements';

  constructor(llm: LLMProvider) {
    super(llm);
  }

  public async run(context: Message[]): Promise<string | null> {
    if (!context || context.length === 0) {
      return null;
    }

    const prompt = `请根据以下需求制定代码变更计划：
1. 需求分析
2. 变更范围
3. 实现步骤
4. 潜在风险
5. 测试计划

需求内容：
${context[0].content}`;

    try {
      const plan = await this._aask(prompt);
      return plan;
    } catch (error) {
      console.error('Error in creating code plan:', error);
      return null;
    }
  }
}