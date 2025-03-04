import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { NodesModule } from './nodes/nodes.module';
import { WorkflowModule } from './workflow/workflow.module';


@Module({
  imports: [
     ConfigModule.forRoot(),
     EventEmitterModule.forRoot(),
     WorkflowModule
    ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
