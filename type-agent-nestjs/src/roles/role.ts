import { Inject, Injectable, Logger } from '@nestjs/common';
import { Message } from '../types/message';
import { Action } from '../actions/action';
import { Memory } from 'src/memory/memory';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RoleName } from 'src/types/role-type';
import { ActionType } from 'src/types/action-type';
import { ThinkAction } from 'src/actions/think.action';
import {  SystemService } from 'src/system/system.service';

export enum RoleState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  ACTING = 'ACTING'
}

export enum RoleReactMode {
  BY_ORDER = 'BY_ORDER',  // 按顺序执行actions
  REACT = 'REACT',        // llm 动态选择下一个action
  PLAN_AND_ACT = 'PLAN_AND_ACT'  // 先规划再执行
}

export abstract class Role {
  protected name: RoleName;
  protected profile: string = '';
  protected goal: string = '';
  protected actions: Action[] = [];
  abstract actions_layout_description?: string;
  protected memory: Memory;
  protected state: RoleState = RoleState.IDLE;
  protected reactMode: RoleReactMode = RoleReactMode.REACT;
  protected maxReactLoop: number = 1;
  protected currentActionIndex: number = -1;
  protected messageBuffer: Message[] = [];
  protected watch: Set<Action | typeof Action> = new Set();
  abstract logger: Logger
  @Inject() eventEmitter: EventEmitter2;
  @Inject() thinkAction :ThinkAction;
  @Inject() system :SystemService;
  

  constructor({
    memory,
    watch = [],
    actions = []
  }:{
    memory: Memory, 
    watch?:(Action | typeof Action)[], 
    actions?: Action[]
  }) {
    this.memory = memory;
    this.watch = new Set(watch);
    this.actions = actions;
  }

  // @OnEvent('message.add')
  // async onMessageAdd(message: Message) {
  //   const watch_names =  this.getWatchActionNames();
    
  //   if(message.cause_by && watch_names.includes(message.cause_by)) {
  //     this.messageBuffer =  await this.memory.searchByCauseByMany(watch_names);
  //     this.react();
  //   }
  // }

  // 接听任务
  @OnEvent('job.dispatch.to')
  async async (role: RoleName) {
    if(role === this.name) {
      this.logger.log(`I am ${this.name}, I am here to help`);
      this.messageBuffer =  await this.memory.searchByCauseByMany(this.getWatchActionNames());
      this.react();
    }
  }

  public getName(): string {
    return this.name;
  }

  public getProfile(): string {
    return this.profile;
  }

  public getGoal(): string {
    return this.goal;
  }

  public getState(): RoleState {
    return this.state;
  }

  public getActions(): Action[] {
    return this.actions;
  }

  protected async think(): Promise<boolean> {
    this.state = RoleState.THINKING;
    
    if (this.actions.length === 1) {
      this.currentActionIndex = 0;
      return true;
    }

    if (this.reactMode === RoleReactMode.BY_ORDER) {
      this.currentActionIndex++;
      return this.currentActionIndex >= 0 && this.currentActionIndex < this.actions.length;
    } else if (this.reactMode === RoleReactMode.REACT || this.reactMode === RoleReactMode.PLAN_AND_ACT) {
      this.messageBuffer =  await this.memory.get();
      const nextState = await this.thinkAction.run(this.messageBuffer, {
        profile: this.profile,
        name: this.name,
        goal: this.goal,
        actions: this.actions,
        currentActionIndex: this.currentActionIndex,
        actions_layout: this.actions_layout_description
      });

      const nextStateNum = parseInt(nextState);
      if (nextStateNum === -1) {
        return false;
      }
      
      this.currentActionIndex = nextStateNum;
      return true;
    }

    return false;
  }

  protected getWatchActionNames(): ActionType[] {
    return Array.from(this.watch).map(action => {
      if (action instanceof Action) {
        return action.getName();
      } else {
        return action.name as ActionType;
      }
    });
  }

  protected async act(): Promise<Message | null> {
    this.state = RoleState.ACTING;
    
    if (this.currentActionIndex < 0 || this.currentActionIndex >= this.actions.length) {
      return null;
    }

    const action = this.actions[this.currentActionIndex];
    const response = await action.run(this.messageBuffer);
    
    if (!response) {
      return null;
    }

    const msg: Message = {
      content: response,
      role: this.name,
      cause_by: action.getName(),
      timestamp: Date.now()
    };

    await this.memory.add(msg);
    return msg;
  }

  protected async react(): Promise<Message | null> {
    let actionsTaken = 0;
    let response: Message | null = null;
    
    this.maxReactLoop = this.actions.length;

    if(this.system.getStatus().status != "generating"){
      return null;
    }

    while (actionsTaken < this.maxReactLoop) {
      if(this.system.getStatus().status != "generating"){
        break;
      }

      if (!await this.think()) {
        break;
      }
      response = await this.act();
      actionsTaken++;
    }

    this.state = RoleState.IDLE;

    this.eventEmitter.emit('job.done');
    return response;
  }

  public abstract  run(message: Message): Promise<any>;
}