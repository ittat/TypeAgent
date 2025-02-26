import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { LLMProvider } from '../llm/llm-provider';
import { Message } from 'src/types/message';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WriteDesignAction extends Action {
  
  static ACTION_NAME: ActionType = ActionType.WRITE_DESIGN;
  protected name = ActionType.WRITE_DESIGN;
  protected desc = '根据需求文档生成系统设计方案，包括系统架构、API设计和数据模型';
  private requirement: string | null = null;

  constructor( llm: LLMProvider) {
    super(llm);
  }

  private designPromptTemplate = `
作为系统架构师，请根据以下需求文档生成详细的系统设计方案：
{requirement}

可能包含以下内容：
1. 系统架构设计
2. 核心模块设计
3. API接口设计
4. 数据模型设计
5. 技术选型建议

请确保设计方案清晰、可扩展且易于实现。
`;

  async run(requirement: Message[]): Promise<string> {
    // this.requirement = requirement;
    // 将Message数组转换为字符串
    this.requirement = requirement.map(msg => msg.content).join('\n');
    const prompt = this.designPromptTemplate.replace('{requirement}', this.requirement);
    const design = await this.llm.ask(prompt);
    return design;
  }
}