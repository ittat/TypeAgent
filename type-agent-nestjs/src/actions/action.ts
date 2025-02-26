import { Injectable } from '@nestjs/common';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export abstract class Action {
  protected name: ActionType = ActionType.NULL;
  public static  ACTION_NAME:ActionType;
  protected desc: string = '';
  protected i_context: string | null = null;
  protected llm: LLMProvider; 

  constructor(llm:LLMProvider) {
    this.llm = llm;
  }

  public getName() {
    return this.name;
  }

  public getDesc(): string {
    return this.desc;
  }

  protected async _aask(prompt: string): Promise<string> {
    // 这里后续会实现与LLM Provider的交互
    if (!this.llm) {
      throw new Error('LLM provider not initialized');
    }
    return await this.llm.ask(prompt);
  }

  public abstract run(context: Message[]): Promise<string | null>;
}