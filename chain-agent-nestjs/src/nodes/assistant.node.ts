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
    
    注意：如果是前端部分代码，优先使用原生的 HTML、CSS、JavaScript 等技术进行开发，而不是使用框架， 例如： React、Vue等。

    请按照以下格式输出（按照严格标准文档输出内容，不要说多余的话！）：
    1. 项目概述
    2. 功能需求
    3. 技术要求
    4. 交付标准
  `);

  private renamePromptTemplate = ChatPromptTemplate.fromTemplate(`
    根据用户的输入，帮助用户将输入的需求生成合适的英文项目名称。
    注意：只需要符合一个合适的英文项目名称即可，不可以有其他废话！
    用户输入: {input}
  `);

  private descPromptTemplate = ChatPromptTemplate.fromTemplate(`
    根据用户的输入，帮助用户生成一段简单的英文描述。
    注意：不可以有其他废话！
    用户输入: {input}
  `);


  async process(input: string): Promise<AIMessageChunk> {
    // return await this.chain.invoke({ input });

   const  result =  await this.promptTemplate.invoke({input})

    const ai_message = this.llm.invoke(result);
    return ai_message;
  }

  async name_action(input: string): Promise<AIMessageChunk> {
   const  result =  await this.renamePromptTemplate.invoke({input})
    const ai_message = this.llm.invoke(result);
    return ai_message;
  }

  async desc_action(input: string): Promise<AIMessageChunk> {
    const  result =  await this.descPromptTemplate.invoke({input})
     const ai_message = this.llm.invoke(result);
     return ai_message;
   }
}