import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LLMProvider } from 'src/llm/llm-provider';

@Injectable()
export class ProductManagerNode {

  constructor(
    private readonly llm: LLMProvider,
  ){}

  
  private promptTemplate = ChatPromptTemplate.fromTemplate(`
    你是一个专业的产品经理，需要根据需求分析结果生成详细的产品文档。
    请仔细分析输入的需求文档，并生成一个完整的产品规划文档。
    
    需求文档(在三个等号之间)：
    === start
    {input}
    === end

  
    请按照以下格式输出产品文档（按照严格标准文档输出内容，不要说多余的话！）：
    1. 产品愿景
    2. 目标用户
    3. 核心功能模块
       - 模块名称
       - 功能描述
       - 用户价值
       - 实现优先级
    4. 产品规格
       - 技术规格
       - 性能要求
       - 安全要求
    5. 验收标准
       - 功能验收标准
       - 性能验收标准
       - 安全验收标准
  `);

  // private chain = RunnableSequence.from([
  //   this.promptTemplate,
  //   new StringOutputParser()
  // ]);

  async process(input: string) {
    // return await this.chain.invoke({ input });
    const  prompt =  await this.promptTemplate.invoke({ input });
    return await this.llm.invoke(prompt);
  }
}