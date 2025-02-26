import { Module } from '@nestjs/common';
import { Memory } from './memory';

@Module({
  providers: [Memory],
  exports: [Memory],
})
export class MemoryModule {}