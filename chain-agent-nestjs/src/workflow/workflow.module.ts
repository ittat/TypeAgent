import { Module, forwardRef } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowManagerService } from './workflow-manager.service';
import { NodesModule } from '../nodes/nodes.module';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowQueueProcessor } from './workflow.queue.processor';
import { WorkflowQueueService } from './workflow.queue.service';



@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.RADIS_HOST || 'localhost',
        port: parseInt(process.env.RADIS_PORT! ?? 6379), 
        password: process.env.RADIS_PWD || undefined,
      },
    }),
    BullModule.registerQueue({
      name: 'workflow',
    }),
    NodesModule,
  ],
  controllers: [WorkflowController],
  providers: [
    WorkflowManagerService,
    WorkflowQueueProcessor,
    WorkflowQueueService
  ],
  exports: [WorkflowManagerService,
    BullModule,
    WorkflowQueueProcessor,
    WorkflowQueueService
  ]
})
export class WorkflowModule {}