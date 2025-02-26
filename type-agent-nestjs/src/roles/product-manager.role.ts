import { Inject, Injectable, Logger } from '@nestjs/common';
import { Role } from './role';
import { Message } from '../types/message';
import { WritePRDReviewAction } from '../actions/write-prd-review.action';
import { Memory } from 'src/memory/memory';
import { PrepareDocumentsAction } from 'src/actions/prepare-documents.action';
import { WritePRDAction } from 'src/actions/write-prd.action';
import { UserRequirementAction } from '../actions/user-requirement.action';
import { RoleName } from 'src/types/role-type';
import { ActionType } from 'src/types/action-type';
import { TaskAnalysisResult, TaskDispatcherAction } from 'src/actions/task-dispatcher.action';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';


@Injectable()
export class ProductManager extends Role {
  protected name = RoleName.ProductManager;
  protected profile = 'Product Manager';
  protected goal = 'efficiently create a successful product that meets market demands and user expectations';
  protected constraints = 'utilize the same language as the user requirements for seamless communication';
  logger: Logger = new Logger(ProductManager.name);
  
  actions_layout_description =`
   在执行"${PrepareDocumentsAction.ACTION_NAME}"之后才可以执行"${WritePRDAction.ACTION_NAME}"文档。
  `
  
  constructor(
    prepareDocuments: PrepareDocumentsAction, 
    writePrd: WritePRDAction, 
    memory: Memory,
    UserRequirementAction:UserRequirementAction,
   
  ) {
    super({
      memory,
      actions:  [prepareDocuments, writePrd],
      watch:[UserRequirementAction]
    });

  }

  public async run(message: Message): Promise<Message> {
    if (!message.content) {
      throw new Error('Message content is required');
    }

    // 观察并记录输入消息
    // await this.observe(message);

    // 检查历史记录中是否有相关的PRD信息
    const prdMessages = await this.memory.searchByCauseBy(ActionType.WRITE_PRD);
    this.messageBuffer = prdMessages;
    // if (prdMessages.length > 0) {
    //   // 如果有PRD信息，将其添加到消息缓冲区
    //   for (const prdMsg of prdMessages) {
    //     await this.observe(prdMsg);
    //   }
    // }

    // 使用react模式执行动作并获取响应
    const response = await this.react();
    this.logger.log(`${this.name} generated response: ${response}`);
    if (!response) {
      throw new Error('Failed to generate PRD review');
    }

    return response;
  }



}