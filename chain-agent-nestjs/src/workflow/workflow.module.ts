import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowManagerService } from './workflow-manager.service';
import { NodesModule } from '../nodes/nodes.module';

@Module({
  imports: [NodesModule],
  controllers: [WorkflowController],
  providers: [WorkflowManagerService],
  exports: [WorkflowManagerService]
})
export class WorkflowModule {}