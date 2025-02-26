import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class SummarizeCodeAction extends Action {
  static ACTION_NAME: ActionType = ActionType.SUMMARIZE_CODE;
  protected name = ActionType.SUMMARIZE_CODE;
  protected desc = 'Analyze and summarize the code to provide a clear overview';

  constructor(llm: LLMProvider) {
    super(llm);
  }

  public async run(context: Message[]): Promise<string | null> {
    if (!context || context.length === 0) {
      return null;
    }

    const prompt = `请分析并总结以下代码：\n${context[0].content}`;
    
    try {
      const summary = await this._aask(prompt);
      return summary;
    } catch (error) {
      console.error('Error in summarizing code:', error);
      return null;
    }
  }
}