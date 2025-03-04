import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LLMProvider } from 'src/llm/llm-provider';

@Injectable()
export class ProjectManagerNode {

   constructor(
      private readonly llm: LLMProvider,
    ){}

    
  private promptTemplate = ChatPromptTemplate.fromTemplate(`
    你是一个专业的项目规划师，需要根据产品文档和技术文档生成详细的项目实现规划。
    请仔细分析输入的文档，并生成阶段性的实现规划文档。
    
    技术架构文档(在三个等号之间)：
    === start
    {techDoc}
    === end


    产品文档(在三个等号之间)：
    === start
    {prodDoc}
    === end
    
    请按照以下格式输出规划文档（按照严格标准文档输出内容，不要说多余的话！）：
    1. 项目里程碑
       - 阶段划分
       - 时间节点
       - 交付物
    2. 迭代计划
       - 迭代周期
       - 功能模块拆分
       - 优先级排序
    3. 资源规划
       - 技术栈要求
       - 开发环境
       - 部署环境
    4. 质量保证
       - 代码规范
       - 测试策略
       - 验收标准
    5. 风险管理
       - 技术风险
       - 进度风险
       - 应对策略
  `);

//   private chain = RunnableSequence.from([
//     this.promptTemplate,
//     new StringOutputParser()
//   ]);

  async process(techDoc: string, prodDoc: string) {
   const  prompt =  await this.promptTemplate.invoke({ techDoc, prodDoc });
   return await this.llm.invoke(prompt);
  }
}