import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { MemoryModule } from 'src/memory/memory.module';
import { ActionsModule } from 'src/actions/actions.module';


@Module({
  imports:[
    ActionsModule,
    MemoryModule
  ],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}