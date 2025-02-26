import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class FixBugAction extends Action {
  static ACTION_NAME: ActionType = ActionType.FIX_BUG;
  protected name = ActionType.FIX_BUG;
  protected desc = 'Analyze and fix bugs in the code';

  constructor(llm: LLMProvider) {
    super(llm);
  }

  public async run(context: Message[]): Promise<string | null> {
    if (!context || context.length === 0) {
      return null;
    }

    const prompt = `请分析以下代码中的bug并提供修复方案：
1. 问题分析
2. 错误原因
3. 修复方案
4. 优化建议

问题代码：
${context[0].content}`;

    try {
      const solution = await this._aask(prompt);
      return solution;
    } catch (error) {
      console.error('Error in fixing bug:', error);
      return null;
    }
  }
}