import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LLMProvider } from 'src/llm/llm-provider';
import { ProjectState } from './graph-state.interface';
import { WorkflowRole } from './workflow-types';


@Injectable()
export class ProgressWatcherNode {

  constructor(
    private readonly llm: LLMProvider,
  ){}

  
  private promptTemplate = ChatPromptTemplate.fromTemplate(`
    你是一个专业的项目进度监控者，需要评估当前项目状态并决定下一步工作的执行者。


    项目需求：{requirement}
    当前角色：{currentRole}
    项目状态：{status}

    可以指派的角色：{roles}

    注意：
    1. 产品文档由${WorkflowRole.ProductManager}完成。
    2. 技术文档由${WorkflowRole.Architect}完成。
    3. 项目计划由${WorkflowRole.ProjectManager}完成。
    4. 代码实现由${WorkflowRole.Engineer}完成。
    5.必须要有产品文档、技术文档、项目计划后，${WorkflowRole.Engineer}才可以开始工作。

    各个角色的工作成果(使用三个等号分割)：

        === 产品文档
        {productDoc}
        ===
    
        === 技术文档
        {techDoc}
        ===
    
        === 项目计划
        {planDoc}
        ===
    
        === 代码文档
        {codeDoc}
        ===

    请直接回答下一步工作的执行者，不要说多余的话。
    你可以在下面的选项中选择：{roles}，如果没有合适的角色，请回答：无。不要说多余的话！
  `);




  async process(state:ProjectState) {
    // return await this.chain.invoke({ currentRole, output, status });
    const { 
      requirement,
      productDoc,
      techDoc,
      planDoc,
      currentRole,
      codeDoc,
      status,
     } = state;
     const roles = Object.values(WorkflowRole).join(',');
    const  prompt =  await this.promptTemplate.invoke({ 
      requirement,
      productDoc,
      techDoc,
      planDoc,
      currentRole,
      codeDoc,
      status,
      roles
     });
    return await this.llm.invoke(prompt);
  }

  
}