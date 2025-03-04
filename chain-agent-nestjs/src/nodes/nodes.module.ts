import { Module } from '@nestjs/common';
import { AssistantNode } from './assistant.node';
import { ProductManagerNode } from './product-manager.node';
import { ArchitectNode } from './architect.node';
import { EngineerNode } from './engineer.node';
import { ProgressWatcherNode } from './progress-watcher.node';
import { LLMModule } from 'src/llm/llm.module';
import { ProjectManagerNode } from './project-manager.node';

@Module({
  imports:[
    LLMModule
  ],
  providers: [
    AssistantNode,
    ProductManagerNode,
    ArchitectNode,
    ProjectManagerNode,
    EngineerNode,
    ProgressWatcherNode
  ],
  exports: [
    AssistantNode,
    ProductManagerNode,
    ArchitectNode,
    ProjectManagerNode,
    EngineerNode,
    ProgressWatcherNode
  ]
})
export class NodesModule {}