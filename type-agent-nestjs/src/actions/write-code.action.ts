import { Injectable } from '@nestjs/common';
import { Action } from './action';
import { LLMProvider } from '../llm/llm-provider';
import { Message } from 'src/types/message';
import { ActionType } from 'src/types/action-type';

@Injectable()
export class WriteCodeAction extends Action {
  static ACTION_NAME: ActionType = ActionType.WRITE_CODE;
  protected name = ActionType.WRITE_CODE;
  protected desc = '根据系统设计方案生成具体的代码实现';
  private design: string | null = null;

  constructor(llm: LLMProvider) {
    super(llm);
  }

  private codePromptTemplate = `
注意事项
角色：你是一位专业的工程师，主要目标是编写符合Google风格、优雅、模块化、易读且易维护的代码
语言：代码标题和内容使用英文，其他说明使用中文
注意：使用 ## 来分隔各个部分

# 上下文信息
## 设计方案
{design}

# 编码要求
请基于以下要求生成代码：
1. 单一职责：专注实现当前文件的功能，确保代码完整可靠且可重用
2. 类型安全：始终使用强类型和显式变量，为所有配置项设置默认值
3. 依赖处理：避免循环依赖，确保正确导入所有必要的模块
4. 遵循设计：严格遵循数据结构和接口设计，不要更改任何设计或使用未定义的公共成员函数
5. 代码规范：
   - 遵循TypeScript最佳实践
   - 确保代码结构清晰，具有良好的可维护性
   - 包含必要的注释和文档
   - 实现完善的错误处理和日志记录
   - 遵循SOLID原则
   - 每个代码文件应该携带完整的文件路径
6. 完整实现：编写所有细节，不要遗漏任何必要的类或函数，不要留下TODO标记

请生成完整的代码实现。
`;

  async run(design: Message[]): Promise<string> {
    // 将Message数组转换为字符串
    const designText = design.map(msg => msg.content).join('\n');
    this.design = designText;
    const prompt = this.codePromptTemplate.replace('{design}', this.design);
    const code = await this.llm.ask(prompt);
    return code;
  }
}