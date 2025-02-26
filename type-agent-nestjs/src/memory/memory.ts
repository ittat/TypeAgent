import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Message } from '../types/message';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class Memory {
  private messages: Message[] = [];
  private maxMemory = 100;
  private readonly logger = new Logger(Memory.name);

  status: "idle" | "busy" | "error" = "idle"

  constructor(private eventEmitter: EventEmitter2) {}

  public async add(message: Message): Promise<void> {
    this.messages.push(message);
    this.logger.log(`Memory size: ${this.messages.length}`);
  }

  public async get(): Promise<Message[]> {
    return this.messages;
  }

  public async clear(): Promise<void> {
    this.messages = [];
  }

  public async getRecentMessages(count: number = 10): Promise<Message[]> {
    return this.messages.slice(-count);
  }

  public async searchByRole(role: string): Promise<Message[]> {
    return this.messages.filter(msg => msg.role === role);
  }

  public async searchByCauseBy(causeBy: ActionType): Promise<Message[]> {
    return this.messages.filter(msg => msg.cause_by === causeBy);
  }
  public async searchByCauseByMany(causeBy: ActionType[]): Promise<Message[]> {
    return this.messages.filter(msg => msg.cause_by && causeBy.includes(msg.cause_by));
  }
}