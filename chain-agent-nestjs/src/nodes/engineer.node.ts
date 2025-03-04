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
    
    请按照以下要求生成代码（不要说多余的话！）：
     - 需要完整的项目代码，不可以是半成品
     - 每个代码文件内容必须是完整的，不可以省略代码
     - 清晰的文件路径命名  
          - 每个代码文件的第一行是文件路径，例如：src/utils/index.ts，表示该文件位于 src/utils 目录下，文件名是 index.ts。
          - 第一行是文件路径，不可以使用注释符号注释。不可以是"/* script.js */"、"<!-- index.html -->"、"// index.js"这类用法
     - 合理的模块划分
     - 符合编码规范
     - 包含必要的注释
     - 实现核心功能
     - 处理异常情况
 
  `);

  private parseMarkdownCodeBlocks(markdown: string): Record<string, string> {
    const result: Record<string, string> = {};
    const codeBlockRegex = /```[\w]*\n([^\n]+)\n([\s\S]*?)\n```/g;
    let match;

    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const [_, filePath, code] = match;
      if (filePath && code) {
        // 移除代码中可能存在的代码块标识符
        const cleanCode = code.replace(/```[\w]*\n|```$/g, '').trim();
        result[filePath.trim()] = cleanCode;
      }
    }

    return result;
  }

  async process(techDoc: string, prodDoc: string, planDoc: string){
    const prompt = await this.promptTemplate.invoke({ techDoc, prodDoc, planDoc });
    const markdownResponse = await this.llm.invoke(prompt);
    const markdown = convertMessageContentToString(markdownResponse.content);
    return {
      ai_message: markdownResponse,
      codeDoc: this.parseMarkdownCodeBlocks(markdown),
    };
  }
}