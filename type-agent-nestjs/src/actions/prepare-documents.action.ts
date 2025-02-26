import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class PrepareDocumentsAction extends Action {
  static ACTION_NAME: ActionType = ActionType.PREPARE_DOCUMENTS;
  protected name = ActionType.PREPARE_DOCUMENTS;
  protected desc = 'Prepare and collect relevant documents for analysis';

  constructor(llm: LLMProvider) {
    super(llm);
  }

  public getName() {
    return this.name;
  }

  public async run(messages: Message[]): Promise<string> {
    // 收集和准备相关文档
    const documents = await this.collectDocuments(messages);
    return this.formatDocuments(documents);
  }

  private async collectDocuments(messages: Message[]): Promise<string[]> {
    // 这里将使用LLM来分析消息并收集相关文档
    const context = messages.map(msg => msg.content);
    
    // 示例文档收集逻辑
    return [
      '用户需求文档',
      '市场分析报告',
      '竞品分析报告'
    ];
  }

  private formatDocuments(documents: string[]): string {
    let output = '## 相关文档清单\n\n';
    
    for (const doc of documents) {
      output += `- ${doc}\n`;
    }

    return output;
  }
}