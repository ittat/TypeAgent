import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WritePRDAction extends Action {
  static ACTION_NAME: ActionType = ActionType.WRITE_PRD
  protected name = ActionType.WRITE_PRD;
  protected desc = 'Write a comprehensive PRD based on user requirements';

  constructor(llm: LLMProvider) {
    super(llm);
  }

  public getName() {
    return this.name;
  }

  public async run(messages: Message[]): Promise<string> {
    // 从消息中提取用户需求
    const requirements = this.extractRequirements(messages);
    
    // 生成PRD文档
    const prd = await this.generatePRD(requirements);
    return this.formatPRD(prd);
  }

  private extractRequirements(messages: Message[]): string[] {
    return messages.map(msg => msg.content);
  }

  private async generatePRD(requirements: string[]): Promise<{
    background: string;
    goals: string[];
    features: Array<{
      name: string;
      description: string;
      priority: string;
    }>;
  }> {
    // 这里将使用LLM来分析需求并生成PRD内容
    return {
      background: '项目背景描述',
      goals: ['目标1', '目标2'],
      features: [
        {
          name: '功能1',
          description: '功能1的详细描述',
          priority: '高'
        },
        {
          name: '功能2',
          description: '功能2的详细描述',
          priority: '中'
        }
      ]
    };
  }

  private formatPRD(prd: {
    background: string;
    goals: string[];
    features: Array<{
      name: string;
      description: string;
      priority: string;
    }>;
  }): string {
    let output = '# 产品需求文档 (PRD)\n\n';

    // 添加背景部分
    output += '## 1. 项目背景\n';
    output += prd.background + '\n\n';

    // 添加目标部分
    output += '## 2. 项目目标\n';
    prd.goals.forEach((goal, index) => {
      output += `${index + 1}. ${goal}\n`;
    });
    output += '\n';

    // 添加功能部分
    output += '## 3. 功能需求\n';
    prd.features.forEach((feature, index) => {
      output += `### 3.${index + 1} ${feature.name}\n`;
      output += `- 描述：${feature.description}\n`;
      output += `- 优先级：${feature.priority}\n\n`;
    });

    return output;
  }
}