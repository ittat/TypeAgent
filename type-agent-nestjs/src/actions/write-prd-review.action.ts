import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { LLMProvider } from 'src/llm/llm-provider';
import { Message } from 'src/types/message';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WritePRDReviewAction extends Action {
  static ACTION_NAME: ActionType = ActionType.WRITE_PRD_REVIEW;
  protected name = ActionType.WRITE_PRD_REVIEW;
  protected desc = 'Based on the PRD, conduct a PRD Review, providing clear and detailed feedback';
  protected prd: string | null = null;

  private prdReviewPromptTemplate = `
请根据以下产品需求文档(PRD)进行评审：
{prd}

作为项目经理，请对此PRD进行评审，并提供您的反馈意见和建议。
`;

constructor(llm:LLMProvider) {
    super(llm);
  }

  async run(prd: Message[]): Promise<string> {
    // this.prd = prd;
    this.prd = prd.map(msg => msg.content).join('\n');
    const prompt = this.prdReviewPromptTemplate.replace('{prd}', this.prd);
    const review = await this._aask(prompt);
    return review;
  }
}