import { Controller, Post, Body, Logger, Get, Param, Header } from '@nestjs/common';
import { WorkflowManagerService } from './workflow-manager.service';
import { WorkflowQueueService } from './workflow.queue.service';

import { v4 as uuidv4 } from 'uuid';

@Controller('workflow')
export class WorkflowController {
  private logger = new Logger(WorkflowController.name);

  constructor(
    private readonly workflowManager: WorkflowManagerService,
    private readonly queueService: WorkflowQueueService
  ) {}

  // @Post('start')
  // async startNow(@Body('requirement') requirement: string) {
  //   try {
  //     const uuid = uuidv4();
  //     this.logger.log('开始工作流');
  //     const result = await this.workflowManager.startWorkflow(requirement, uuid);
  //     return {
  //       status:'success',
  //       uuid,
  //       result
  //     };
  //   } catch (error) {
  
  //     throw error;
  //   }
  // }


  @Post('start')
  async startWorkflow(@Body('requirement') requirement: string) {
    try {
      this.logger.log('添加工作流任务到队列');
      const uuid = await this.queueService.addToQueue(requirement);
      return {
        status: 'success',
        uuid,
        message: '工作流任务已添加到队列'
      };
    } catch (error) {
      this.logger.error(`添加工作流任务失败: ${error.message}`);
      throw error;
    }
  }

  @Get('status/:uuid')
  async getWorkflowStatus(@Param('uuid') uuid: string) {
    try {
      const state = await this.queueService.getJobState(uuid);
      if (!state) {
        return {
          status: 'error',
          message: '未找到指定的工作流任务'
        };
      }
      return {
        status: 'success',
        state
      };
    } catch (error) {
      this.logger.error(`获取工作流状态失败: ${error.message}`);
      throw error;
    }
  }


  @Get('queue-status')
  @Header("Cache-Control", "no-cache")
  async getQueueStatus() {
    try {
      const queueInfo = await this.queueService.workflowQueue.getJobCounts();
      return {
        status: 'success',
        data: {
          waiting: queueInfo.waiting,
          active: queueInfo.active,
          completed: queueInfo.completed,
          failed: queueInfo.failed,
          delayed: queueInfo.delayed,
          // paused: queueInfo.paused
        }
      };
    } catch (error) {
      this.logger.error(`获取队列状态失败: ${error.message}`);
      throw error;
    }
  }
}