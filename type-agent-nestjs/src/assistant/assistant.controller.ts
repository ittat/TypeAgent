import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ProductManager } from '../roles/product-manager.role';
import { Architect } from '../roles/architect.role';
import { Engineer } from '../roles/engineer.role';
import { ProjectManager } from '../roles/project-manager.role';
import { Memory } from 'src/memory/memory';
import { ActionType } from 'src/types/action-type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Message } from 'src/types/message';
import { RoleName } from 'src/types/role-type';
import { SystemService } from 'src/system/system.service';
@Controller('assistant')
export class AssistantController {
  constructor(
    private readonly productManager: ProductManager,
    private readonly architect: Architect,
    private readonly engineer: Engineer,
    private readonly projectManager: ProjectManager,
    private readonly memory: Memory,
    private eventEmitter: EventEmitter2,
    private readonly system: SystemService,
  ) {}

  @Post('analyze-requirement')
  async analyzeRequirement(@Body('content') content: string) {
    // console.log("dasdsad");
    
    this.system.start(content)
  }

  @Get('memory')
  async getMemory(
    @Query('role') role?: string,
    @Query('causeBy') causeBy?: string,
    @Query('count') count?: number,
  ) {
    if (role) {
      return await this.memory.searchByRole(role);
    }
    if (causeBy) {
      return await this.memory.searchByCauseBy(causeBy as ActionType);
    }
    if (count) {
      return await this.memory.getRecentMessages(count);
    }
    return await this.memory.get();
  }
  @Get('roles')
  async getRoles() {
    const roles = [
      {
        name: this.productManager.getName(),
        state: this.productManager.getState(),
        desc: this.productManager.getGoal(),
      },
      {
        name: this.architect.getName(),
        state: this.architect.getState(),
        desc: this.architect.getGoal(),
      },
      {
        name: this.engineer.getName(),
        state: this.engineer.getState(),
        desc: this.engineer.getGoal(),
      },
      {
        name: this.projectManager.getName(),
        state: this.projectManager.getState(),
        desc: this.projectManager.getGoal(),
      },
    ];
    return roles;
  }
  @Get('check-generation')
  async checkGenerationStatus() {
   const info =  this.system.getStatus();
    
    return info;
  }

  @Post('stop-generation')
  async stopGeneration() {
    await this.system.reset();
    return { success: true, message: '已停止代码生成' };
  }
}