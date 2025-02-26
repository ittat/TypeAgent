import { Injectable, Logger } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class UserRequirementAction extends Action {
  static ACTION_NAME: ActionType = ActionType.USER_REQUIREMENT;
  name = ActionType.USER_REQUIREMENT;
  logger = new Logger(UserRequirementAction.name);

  constructor( llm: LLMProvider) {
    super(llm);
  }

  async run(messages: Message[]): Promise<string> {
    // 验证用户输入
    if (!messages) {
        this.logger.error('Message is required');
        return "THIS IS AN ERROR MESSAGE"
    }
    
    const content = messages.map(msg => msg.content).join('\n');

    // 分析用户需求的提示词
    const prompt = `Please analyze the following user requirement and break it down into clear, specific, and actionable items:
    
    ${content}
    
    Please provide:
    1. The main goal/objective
    2. Key features/requirements
    3. Any constraints or limitations
    4. Potential challenges
    5. Success criteria`;

    // 使用 LLM 分析需求
    const analysis = await this.llm.ask(prompt);

    // 返回分析结果
    return analysis;
  }
}
