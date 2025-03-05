import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WorkflowModule } from './workflow/workflow.module';
import { RedisCacheModule } from './base/radis.module';
import { HealthModule } from './health/health.module';
// import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    {
      module:RedisCacheModule,
      global: true,
    },
     ConfigModule.forRoot(),
     EventEmitterModule.forRoot(),
     WorkflowModule,
     HealthModule
    ],
  controllers: [],
  providers: [],
  exports:[]
})
export class AppModule {}
