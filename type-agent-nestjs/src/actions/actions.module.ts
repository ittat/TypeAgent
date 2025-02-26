import { Module } from '@nestjs/common';
import { WriteDesignAction } from './write-design.action';
import { WriteCodeAction } from './write-code.action';
import { WritePRDReviewAction } from './write-prd-review.action';
import { WriteTasks } from './write-tasks';
import { LLMModule } from 'src/llm/llm.module';
import { MemoryModule } from 'src/memory/memory.module';
import { PrepareDocumentsAction } from './prepare-documents.action';
import { WritePRDAction } from './write-prd.action';
import { UserRequirementAction } from './user-requirement.action';
import { WriteTasksAction } from './write-tasks.action';
import { WriteCodeReviewAction } from './write-code-review.action';
import { FixBugAction } from './fix-bug.action';
import { WriteCodePlanAndChangeAction } from './write-code-plan-and-change.action';
import { SummarizeCodeAction } from './summarize-code.action';
import { TaskDispatcherAction } from './task-dispatcher.action';
import { ThinkAction } from './think.action';


export const ActionList = [
  WriteDesignAction,
  WriteCodeAction,
   WritePRDReviewAction,
    WriteTasks,
     PrepareDocumentsAction,
     WritePRDAction, 
     UserRequirementAction,
     WriteTasksAction, 
        SummarizeCodeAction,
 WriteCodeReviewAction,
 FixBugAction,
 WriteCodePlanAndChangeAction,
 TaskDispatcherAction,
 ThinkAction
];


@Module({
imports:[LLMModule,MemoryModule],
  providers: ActionList,
  exports: ActionList,
})
export class ActionsModule {}