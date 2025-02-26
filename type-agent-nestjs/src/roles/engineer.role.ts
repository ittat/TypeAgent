import { Inject, Injectable, Logger } from '@nestjs/common';
import { Role } from './role';
import { Message } from '../types/message';
import { WriteCodeAction } from '../actions/write-code.action';
import { Memory } from 'src/memory/memory';
import { WriteDesignAction } from 'src/actions/write-design.action';
import { RoleName } from 'src/types/role-type';
import { ActionType } from 'src/types/action-type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class Engineer extends Role {
  protected name = RoleName.Engineer;
  protected profile = 'Software Engineer';
  protected goal = 'implement high-quality, maintainable code according to the technical design and architecture specifications';
  protected constraints = 'follow coding standards, write clean code, ensure proper test coverage, and maintain code quality';
  logger: Logger = new Logger(Engineer.name);
  actions_layout_description?: string | undefined;

  constructor(
    memory: Memory,
    writeCodeAction: WriteCodeAction,
    writeDesignAction:WriteDesignAction,
  ) {
    super({
      memory,
      actions: [writeCodeAction],
      watch:[writeDesignAction]
    });
  }

  public async run(message: Message): Promise<Message> {
    if (!message.content) {
      throw new Error('Message content is required');
    }

    const designMessages = await this.memory.searchByCauseBy(ActionType.WRITE_DESIGN);
    this.messageBuffer = designMessages

    const response = await this.react();
    if (!response) {
      throw new Error('Failed to generate code');
    }

    return response;
  }
}