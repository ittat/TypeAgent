import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LLMProvider } from 'src/llm/llm-provider';

@Injectable()
export class ArchitectNode {


   constructor(
      private readonly llm: LLMProvider,
    ){}
  

  private promptTemplate = ChatPromptTemplate.fromTemplate(`
    你是一个专业的技术架构师，需要根据产品文档设计合理的技术架构方案。
    请仔细分析输入的产品文档，并生成技术架构设计文档和实现细节文档。
    
    产品文档(在三个等号之间)：
    === start
    {input}
    === end
    
    注意：在项目框架设计的时候，如果遇到需要开发出web页面的项目时，前端页面设计不要使用任何web框架，例如React、Vue、Vite、Webpack等！

    请按照以下格式输出技术文档（按照严格标准文档输出内容，不要说多余的话！）：
    1. 系统架构概述
       - 整体架构设计
       - 核心技术选型
       - 系统分层设计
    2. 详细技术方案
       - 数据模型设计
       - API接口设计
       - 服务模块划分
       - 核心算法实现
    3. 技术实现细节
       - 开发框架和工具
       - 代码组织结构
       - 关键技术点实现
       - 性能优化方案
    4. 部署和运维
       - 部署架构
       - 监控方案
       - 扩展性设计
    5. 技术风险评估
       - 潜在技术风险
       - 应对措施
       - 备选方案
  `);

  // 2. 定义核心提示模板
  private ARCH_PROMPT = ChatPromptTemplate.fromTemplate(`
   作为CTO，请参考产品文档和技术架构文档，为当前设计模块化源代码项目文件列表。

   产品文档(在三个等号之间)：
    === start
    {prodDoc}
    === end

   技术架构文档(在三个等号之间)：
    === start
    {techDoc}
    === end

   输出格式是全部项目文件的路径命名数组(没有元素都应该以文件结尾，而不能只有路径)，例如：["index.html","src/index.js","src/utils/index.js","server.py"]

   请按照说明，生成文件列表（不要说如何多余的话！）：
  `);

  async process(input: string) {
   const  result =  await this.promptTemplate.invoke({input})
   return  await this.llm.invoke(result);
  }

  async processArch(prodDoc: string, techDoc: string) {
    const  result =  await this.ARCH_PROMPT.invoke({prodDoc, techDoc})
    return  await this.llm.invoke(result);
   }
}