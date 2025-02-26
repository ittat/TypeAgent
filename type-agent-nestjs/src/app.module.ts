import {  Module } from '@nestjs/common';
import { AssistantModule } from './assistant/assistant.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { SystemModule } from './system/system.module';


@Module({
  imports: [
    AssistantModule,
     ConfigModule.forRoot(),
     EventEmitterModule.forRoot()
    ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
