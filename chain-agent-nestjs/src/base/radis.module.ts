import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
        type:"single",
      options: {
        host: process.env.RADIS_HOST || 'localhost',
        port: parseInt(process.env.RADIS_PORT! ?? 6379), 
        password: process.env.RADIS_PWD || undefined,
      },
    }),
  ],
})
export class RedisCacheModule {}