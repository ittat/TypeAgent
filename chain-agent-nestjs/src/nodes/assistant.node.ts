import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LLMProvider } from 'src/llm/llm-provider';
import { AIMessageChunk } from '@langchain/core/messages';

@Injectable()
export class AssistantNode {

  constructor(
    private readonly llm: LLMProvider,
  ){}

  private promptTemplate = ChatPromptTemplate.fromTemplate(`
    你是一个专业的需求分析师，需要帮助用户将输入的需求转化为更加清晰和具体的需求描述。
    请仔细分析用户的输入，并生成一个结构化的需求文档。
    
    用户输入: {input}
    
    请按照以下格式输出（按照严格标准文档输出内容，不要说多余的话！）：
    1. 项目概述
    2. 功能需求
    3. 技术要求
    4. 交付标准
  `);

  // private chain = RunnableSequence.from([
  //   this.promptTemplate,
  //   new StringOutputParser()
  // ]);

  async process(input: string): Promise<AIMessageChunk> {
    // return await this.chain.invoke({ input });

   const  result =  await this.promptTemplate.invoke({input})

    const ai_message = this.llm.invoke(result);
    return ai_message;
  }
}