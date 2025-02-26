import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { Message } from '../types/message';
import { LLMProvider } from 'src/llm/llm-provider';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WriteTasks extends Action {
  static ACTION_NAME: ActionType = ActionType.WRITE_TASKS;
  protected name = ActionType.WRITE_TASKS;
  private context: string[] = [];

  constructor(llm:LLMProvider) {
    super(llm);
  }

  public getName() {
    return this.name;
  }

  public async run(messages: Message[]): Promise<string> {
    // 收集上下文信息
    this.context = messages.map(msg => msg.content);

    // 分析设计文档，提取任务
    const tasks = await this.analyzeTasks();

    // 格式化输出
    return this.formatTasks(tasks);
  }

  private async analyzeTasks(): Promise<Array<{
    id: string;
    title: string;
    priority: number;
    dependencies: string[];
    estimated_hours: number;
  }>> {
    // 这里将使用LLM来分析设计文档并生成任务列表
    // 示例任务结构
    return [
      {
        id: 'TASK-1',
        title: '设置项目基础结构',
        priority: 1,
        dependencies: [],
        estimated_hours: 4
      },
      {
        id: 'TASK-2',
        title: '实现核心数据模型',
        priority: 2,
        dependencies: ['TASK-1'],
        estimated_hours: 8
      }
    ];
  }

  private formatTasks(tasks: Array<{
    id: string;
    title: string;
    priority: number;
    dependencies: string[];
    estimated_hours: number;
  }>): string {
    let output = '## 任务分解\n\n';
    
    // 添加任务总览
    output += '### 任务概述\n';
    output += `总任务数：${tasks.length}\n`;
    output += `预计总工时：${tasks.reduce((sum, task) => sum + task.estimated_hours, 0)}小时\n\n`;

    // 添加详细任务列表
    output += '### 详细任务列表\n';
    tasks.sort((a, b) => a.priority - b.priority);
    
    for (const task of tasks) {
      output += `\n#### ${task.id}: ${task.title}\n`;
      output += `- 优先级: ${task.priority}\n`;
      output += `- 预计工时: ${task.estimated_hours}小时\n`;
      output += `- 依赖任务: ${task.dependencies.length ? task.dependencies.join(', ') : '无'}\n`;
    }

    return output;
  }
}