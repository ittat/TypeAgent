import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WriteCodeReviewAction extends Action {
  static ACTION_NAME: ActionType = ActionType.WRITE_CODE_REVIEW
  protected name = ActionType.WRITE_CODE_REVIEW;
  protected desc = 'Review code for quality, maintainability, and best practices';

  constructor(llm: LLMProvider) {
    super(llm);
  }

  public async run(context: Message[]): Promise<string | null> {
    if (!context || context.length === 0) {
      return null;
    }

    const prompt = `请对以下代码进行全面的代码评审，包括：
1. 代码质量评估
2. 可维护性分析
3. 最佳实践遵循情况
4. 潜在的问题和改进建议

代码内容：
${context[0].content}`;

    try {
      const review = await this._aask(prompt);
      return review;
    } catch (error) {
      console.error('Error in code review:', error);
      return null;
    }
  }
}