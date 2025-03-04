import { Module } from '@nestjs/common';
import { LLMProvider } from './llm-provider';
import { GeminiProxyController } from './gemini-proxy.controller';

@Module({
  controllers: [GeminiProxyController],
  providers: [LLMProvider],
  exports: [LLMProvider],
})
export class LLMModule {}