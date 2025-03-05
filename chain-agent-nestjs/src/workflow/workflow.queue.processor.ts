import { Logger } from '@nestjs/common';
import { WorkflowManagerService } from './workflow-manager.service';
import { WorkflowQueueService } from './workflow.queue.service';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('workflow', {
  concurrency: 2 // 设置并发处理数量为3
})
export class WorkflowQueueProcessor extends WorkerHost {

  private readonly logger = new Logger(WorkflowQueueProcessor.name);

  constructor(
    private readonly workflowManager: WorkflowManagerService,
    private readonly queueService: WorkflowQueueService,
  ) {
    super();
  }

  // 处理队列任务
  async process(job: Job<any, any, string>): Promise<any> {
    const { requirement, uuid } = job.data;
    this.logger.log(`开始处理工作流任务: ${uuid}`);

    try {
      // 更新任务状态为处理中
      this.queueService.updateJobState(uuid, { status: 'processing' });

      // 执行工作流
      const result = await this.workflowManager.runWorkflow(requirement,uuid) as any;

      // 更新任务状态为完成
      this.queueService.updateJobState(uuid, {
        status: 'completed',
        // result: result,
      });

      this.logger.log(`工作流任务完成: ${uuid}`);
      return result;
    } catch (error) {
      // 更新任务状态为失败
      this.queueService.updateJobState(uuid, {
        status: 'failed',
        error: error.message,
      });

      this.logger.error(`工作流任务失败: ${uuid}, 错误: ${error.message}`);
      throw error;
    }
  }
}