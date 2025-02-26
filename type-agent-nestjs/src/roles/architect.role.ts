import { Inject, Injectable, Logger } from '@nestjs/common';
import { Role } from './role';
import { Message } from '../types/message';
import { WriteDesignAction } from '../actions/write-design.action';
import { Memory } from 'src/memory/memory';
import { WritePRDAction } from '../actions/write-prd.action';
import { UserRequirementAction } from '../actions/user-requirement.action';
import {  ActionType } from 'src/types/action-type';
import { RoleName } from 'src/types/role-type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class Architect extends Role {
  protected name = RoleName.Architect;
  protected profile = 'System Architect';
  protected goal = 'design a robust, scalable, and maintainable system architecture that meets the requirements specified in the PRD';
  protected constraints = 'follow industry best practices, consider scalability, maintainability, and security';
  logger: Logger = new Logger(Architect.name);
  actions_layout_description?: string | undefined;


  constructor(
    writeDesign: WriteDesignAction,
    memory: Memory,
    writePRDAction:WritePRDAction,
    userRequirementAction:UserRequirementAction
  ) {
    super({
      memory,
      actions: [writeDesign],
      watch:[
        writePRDAction,
      ]
    });
  }

  public async run(message: Message): Promise<Message> {
    if (!message.content) {
      throw new Error('Message content is required');
    }

    const designMessages = await this.memory.searchByCauseByMany([ActionType.WRITE_PRD, ActionType.ADD_REQUIREMENT]);
    this.messageBuffer = designMessages

    const response = await this.react();
    if (!response) {
      throw new Error('Failed to generate design');
    }

    return response;
  }
}