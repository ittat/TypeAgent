import { Module } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { LLMModule } from '../llm/llm.module';
import { MemoryModule } from '../memory/memory.module';
import { RolesModule } from '../roles/roles.module';
import { ActionsModule } from '../actions/actions.module';
import { SystemModule } from 'src/system/system.module';

@Module({
  imports: [LLMModule, MemoryModule, RolesModule, ActionsModule,SystemModule],
  controllers: [AssistantController],
})
export class AssistantModule {}

