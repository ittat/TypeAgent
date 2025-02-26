import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Memory } from '../memory/memory';
import { RoleName } from '../types/role-type';
import { ActionType } from '../types/action-type';
import { Message } from '../types/message';
import { ProductManager } from '../roles/product-manager.role';
import { TaskAnalysisResult, TaskDispatcherAction } from '../actions/task-dispatcher.action';

export interface CodeGenerationStatus {
  status: 'idle' | 'generating' | 'error' | 'completed';
  error?: string;
}

@Injectable()
export class SystemService {
  private status: CodeGenerationStatus = {
    status: 'idle',
  };

  private readonly logger = new Logger(SystemService.name);

  constructor(
    // private readonly productManager: ProductManager,
    private readonly memory: Memory,
    private readonly eventEmitter: EventEmitter2,
    private readonly taskDispatcherAction: TaskDispatcherAction,
  ) {}

  public async start(user_input:string): Promise<void> {

    if (this.isGenerating()) {
      // this.logger.log('Code generation is already in progress');
      // return;
      this.reset();
    }

    this.status = {
      status: 'generating',
    };
    const message = {
      content:user_input,
      role: RoleName.Human,
      cause_by: ActionType.USER_REQUIREMENT,
      timestamp: Date.now(),
    } as Message;

    await this.memory.clear();
    await this.memory.add(message);
     this.taskDispatcher();


    this.eventEmitter.emit('code.generation.started', this.status);
    this.logger.log('Code generation started');
  }

  public reset(): void {
    this.status = {
      status: 'idle',
    };
    this.eventEmitter.emit('code.generation.reset', this.status);
    this.logger.log('Code generation status reset');
  }

  public getStatus(): CodeGenerationStatus {
    return { ...this.status };
  }

  public isGenerating(): boolean {
    return this.status.status === 'generating';
  }

    // 项目经理还有有个功能，就是在项目终止后判断应该由谁做出下一次任务由谁处理
    @OnEvent('job.done')
    async taskDispatcher() {
      
      const docs = await this.memory.get();
  
      const resultStr = await  this.taskDispatcherAction.run(docs);
      if(  resultStr == null ){
        this.logger.log(`taskDispatcher result is null`);
        this.reset();
        
        return;
      }
      const result =  JSON.parse(resultStr) as TaskAnalysisResult
      // this.logger.log(`taskDispatcher result: ${result}`);
      this.logger.log(`next headler roleName: ${result.nextHandler}`);
      const roles = Object.values(RoleName);
      if(!result.isDone && roles.includes(result.nextHandler)){
  
        const message: Message = {
          content: result.taskDescription,
          role: RoleName.System,
          cause_by: ActionType.TASK_DISPATCHER,
          send_to: result.nextHandler,
          timestamp: Date.now()
        };
  
        // 添加消息
        await this.memory.add(message);
      
  
      // 派发job
      this.eventEmitter.emit('job.dispatch.to', result.nextHandler);
      }else{
        this.logger.log(`next headler roleName: ${result.nextHandler} is not a valid role`);
      }
    }


}