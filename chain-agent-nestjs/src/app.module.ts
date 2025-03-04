import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NodesModule } from './nodes/nodes.module';
import { WorkflowController } from './nodes/workflow.controller';
import { WorkflowManagerService } from './nodes/workflow-manager.service';
import { LLMModule } from './llm/llm.module';

@Module({
  imports: [
     ConfigModule.forRoot(),
     EventEmitterModule.forRoot(),
     NodesModule,
    //  LLMModule
    ],
  controllers: [WorkflowController],
  providers: [WorkflowManagerService],
  exports:[]
})
export class AppModule {}
