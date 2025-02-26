import { Injectable, Logger } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';
import { json } from 'stream/consumers';

@Injectable()
export class ThinkAction extends Action {
  static ACTION_NAME: ActionType = ActionType.THINK;
  private readonly logger = new Logger(ThinkAction.name);
  protected name = ActionType.THINK;

  constructor(llm: LLMProvider) {
    super(llm);
  }

  async run(messages: Message[], context?: {
    profile: string;
    name: string;
    goal: string;
    actions: Action[];
    currentActionIndex: number;
    actions_layout?: string;
  }): Promise<string> {
    this.logger.log('Thinking about next action...');
    
    if (!context) {
      throw new Error('Context is required for thinking');
    }

    if (context.actions.length === 1) {
      return '0';
    }

    const history = messages;
    const states = context.actions.map((action, index) => `${index}. ${action.getName()}`);

    // 构建提示词让LLM选择下一个动作
    const prefix = `${context.profile}(${context.name}): ${context.goal}\n`;
    const layout_instruction = context.actions_layout ? ` 说明：\n\t ${context.actions_layout}` : '';
    const prompt = `${prefix}
    根据以下历史记录和可用的动作，选择下一步最合适的行为：
   
    历史记录：
    \`\`\`json
     ${JSON.stringify(history, null, 2)}
    \`\`\`

    可用的动作(如果没有合适的动作，或者全部动作已经在历史记录中已经有执行了，则可以返回-1)：
    ${states.join('\n')}
    
    当前状态：
    ${context.currentActionIndex  == -1 ? '无' : `${context.currentActionIndex}. ${context.actions[context.currentActionIndex].getName()}`}
    
    ${layout_instruction}

    请选择下一个动作的编号(0-${states.length-1})（输入-1表示结束）：`;


    this.logger.log(`Prompt: ${prompt}`);

    // 使用LLM来选择下一个动作
    const response = await this.llm.ask(prompt);
    const nextState = parseInt(response.trim());
    
    if (isNaN(nextState) || nextState < -1 || nextState >= context.actions.length) {
      this.logger.warn(`Invalid next state: ${nextState}, will return -1`);
      return '-1';
    }

    return nextState.toString();
  }
}