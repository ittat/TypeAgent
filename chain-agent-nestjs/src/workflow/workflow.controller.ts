import { Controller, Post, Body, Logger, Get, Param, Header } from '@nestjs/common';
import { WorkflowManagerService } from './workflow-manager.service';
import { WorkflowQueueService } from './workflow.queue.service';

import { v4 as uuidv4 } from 'uuid';
import { ProjectState, WorkflowState, WorkflowStatus } from 'src/types/workflow.types';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

interface Response {
  status: 'queue'| 'progress' | 'complete' | 'error';
  state?:ProjectState;
  message?:string;
}

@Controller('workflow')
export class WorkflowController {
  private logger = new Logger(WorkflowController.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
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
  async getWorkflowStatus(@Param('uuid') uuid: string): Promise<Response> {


    try {
      // const queueState = await this.queueService.getJobState(uuid);
      // if (!queueState) {
      //   return {
      //     status: 'error',
      //     message: '任务未找到'
      //   };
      // }


        //  从redis中获取
        // this.logger.log('从redis中获取工作流状态');
       const stateStr =  await this.redis.get(`project-${uuid}`);
       if(!stateStr) {
        return {
          status: "queue",
          message: '任务未开始'
        };
       }

       const state = JSON.parse(stateStr) as ProjectState;
 
        return {
          status: state.status == WorkflowStatus.End ? "complete" : "progress",
          state:state
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

  @Get('projects')
  async getAllProjects() {
    try {
      // 获取所有以project-为前缀的键
      const keys = await this.redis.keys('project-*');
      
      // 获取所有项目的数据
      const projects = await Promise.all(
        keys.map(async (key) => {
          const stateStr = await this.redis.get(key);
          if (stateStr) {
            const state = JSON.parse(stateStr) as ProjectState;
            return {
              uuid: state.uuid,
              status: state.status,
              projectName: state.projectName,
              requirement: state.requirement,
              currentRole: state.currentRole
            };
          }
          return null;
        })
      );

      // 过滤掉null值并返回结果
      return {
        status: 'success',
        data: projects.filter(project => project !== null).slice(0,10)
      };
    } catch (error) {
      this.logger.error(`获取项目列表失败: ${error.message}`);
      throw error;
    }
  }
}