import { Inject, Injectable, Logger } from '@nestjs/common';
import { Role } from './role';
import { WriteTasks } from '../actions/write-tasks';
import { Memory } from 'src/memory/memory';
import { Message } from 'src/types/message';
import {  ActionType } from 'src/types/action-type';
import { RoleName } from 'src/types/role-type';
import { WritePRDAction } from 'src/actions/write-prd.action';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProjectManager extends Role {
  actions_layout_description?: string | undefined;
  name = RoleName.ProjectManager;
  profile = 'Project Manager';
  goal = 'break down tasks according to PRD/technical design, generate a task list, and analyze task dependencies to start with the prerequisite modules';
  constraints = 'use same language as user requirement';
  logger: Logger = new Logger(ProjectManager.name);
  @Inject()  eventEmitter: EventEmitter2;

  constructor(
    writeTasks: WriteTasks,
    memory: Memory,
    writePRDAction: WritePRDAction, 
  ) {
    super({
      memory,
      actions: [writeTasks],
      watch:[writePRDAction]
    });
  }

  public async run(message: Message): Promise<Message> {
    if (!message.content) {
      throw new Error('Message content is required');
    }

    const designMessages = await this.memory.searchByCauseBy(ActionType.WRITE_DESIGN);
    this.messageBuffer = designMessages;

    const response = await this.react();
    if (!response) {
      throw new Error('Failed to generate tasks');
    }

    return response;
  }
}