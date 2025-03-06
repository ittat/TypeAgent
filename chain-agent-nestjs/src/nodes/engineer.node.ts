import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LLMProvider } from 'src/llm/llm-provider';
import { convertMessageContentToString } from 'src/utils';

@Injectable()
export class EngineerNode {

  constructor(
    private readonly llm: LLMProvider,
  ){}

  
  private promptTemplate = ChatPromptTemplate.fromTemplate(`
    你是一个专业的软件工程师，需要根据项目文档生成高质量的源代码。
    请仔细分析输入的文档，并生成符合要求的代码实现。
    
    技术架构文档(在三个等号之间)：
    === start
    {techDoc}
    === end

    产品文档(在三个等号之间)：
    === start
    {prodDoc}
    === end

    规划文档(在三个等号之间)：
    === start
    {planDoc}
    === end

    当前项目需要生成代码的文件列表(在三个等号之间)：
    === start
    {files}
    === end
    
    请按照以下要求生成代码（不要说多余的话！）：
     - 需要完整的项目代码，不可以是半成品
     - 每个代码文件内容必须是完整的，不可以省略代码
     - 清晰的文件路径命名  
        - 每个代码使用标准的markdown代码块写法
        - 每个代码块之前有4号小标题，标题内容是对应文件的文件路径，例如："#### src/utils/index.ts"、"#### index.html"、"#### script.js"、"#### script.py"
     - 合理的模块划分
     - 符合编码规范
     - 包含必要的注释
     - 实现核心功能
     - 处理异常情况
 
  `);





private FILE_PROMPT = ChatPromptTemplate.fromTemplate(`
  作为全栈工程师，请设计文档和地区决定，生成指定文件的代码。
  技术架构文档(在三个等号之间)：
  === start
  {techDoc}
  === end

  产品文档(在三个等号之间)：
  === start
  {prodDoc}
  === end

  规划文档(在三个等号之间)：
  === start
  {planDoc}
  === end

  当前项目结构文件列表(在三个等号之间)：
  === start
  {currentStructure}
  === end

  当前项目已经生成的代码(在三个等号之间)：
  === start
  {source}
  === end


  要生成的文件路径：{file}
  生成代码(不可以有多余的话！！！)：`);

  private parseMarkdownCodeBlocks(markdown: string): Record<string, string> {
    const result: Record<string, string> = {};
    const titleAndCodeBlockRegex = /####\s+([^\n]+)\s*\n\s*```[\w]*\n([\s\S]*?)\n```/g;
    let match;

    while ((match = titleAndCodeBlockRegex.exec(markdown)) !== null) {
      const [_, filePath, code] = match;
      if (filePath && code) {
        // 移除可能的多余空格
        const cleanFilePath = filePath.trim();
        // 移除代码中可能存在的代码块标识符
        const cleanCode = code.replace(/```[\w]*\n|```$/g, '').trim();
        result[cleanFilePath] = cleanCode;
      }
    }

    return result;
  }



  async process(techDoc: string, prodDoc: string, planDoc: string,files:string[]){
    const prompt = await this.promptTemplate.invoke({ techDoc, prodDoc, planDoc,files:JSON.stringify(files) });
    const markdownResponse = await this.llm.invoke(prompt);
    const markdown = convertMessageContentToString(markdownResponse.content);
    return {
      ai_message: markdownResponse,
      codeDoc: this.parseMarkdownCodeBlocks(markdown),
    };
  }


  async processOnefile(techDoc: string, prodDoc: string, planDoc: string, file:string, currentStructure:string[],source:any){
    const prompt = await this.FILE_PROMPT.invoke({ techDoc, prodDoc, planDoc,file,currentStructure:JSON.stringify(currentStructure), source:JSON.stringify(source) });
    const codeResponse = await this.llm.invoke(prompt);
    const code = convertMessageContentToString(codeResponse.content);
    const cleanCode = code.replace(/```[\w]*\n|```$/g, '').trim();
    return cleanCode
  }
}