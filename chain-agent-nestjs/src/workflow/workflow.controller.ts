import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WorkflowManagerService } from './workflow-manager.service';

@Controller('workflow')
export class WorkflowController {
  private logger = new Logger(WorkflowController.name);

  constructor(
    private readonly workflowManager: WorkflowManagerService
  ) {}

  @Post('start')
  async startWorkflow(@Body('requirement') requirement: string) {
    try {
      this.logger.log('开始执行工作流');
      
      // 使用工作流管理器执行工作流
      const result = await this.workflowManager.runWorkflow(requirement);
      
      this.logger.log('工作流执行完成');
      
      return {
        status: 'success',
        state: result,
      };
    } catch (error) {
      this.logger.error(`工作流执行失败: ${error.message}`);
      throw error;
    }
  }
}