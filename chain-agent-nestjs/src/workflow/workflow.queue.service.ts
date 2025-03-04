import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowJobData {
  requirement: string;
  uuid: string;
}

export interface WorkflowJobState {
  uuid: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

@Injectable()
export class WorkflowQueueService {
  private readonly logger = new Logger(WorkflowQueueService.name);
  private readonly jobStates = new Map<string, WorkflowJobState>();

  constructor(
    @InjectQueue('workflow') public readonly workflowQueue: Queue,
  ) {}

  async addToQueue(requirement: string): Promise<string> {
    const uuid = uuidv4();
    const jobData: WorkflowJobData = {
      requirement,
      uuid,
    };

    // 初始化作业状态
    this.jobStates.set(uuid, {
      uuid,
      status: 'pending',
    });

    // 添加到队列
    await this.workflowQueue.add('process-workflow', jobData, {
      removeOnComplete: true,
      removeOnFail: false,
    });

    return uuid;
  }


  async getJobState(uuid: string): Promise<WorkflowJobState | null> {
    return this.jobStates.get(uuid) || null;
  }

  updateJobState(uuid: string, state: Partial<WorkflowJobState>) {
    const currentState = this.jobStates.get(uuid);
    if (currentState) {
      this.jobStates.set(uuid, { ...currentState, ...state });
    }
  }
}