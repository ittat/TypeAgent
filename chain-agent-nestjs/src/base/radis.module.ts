import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
        type:"single",
      options: {
        host: 'localhost', // Redis服务器地址
        port: 6379,       // Redis端口
        // password: 'your_password', // 如果有设置密码的话
      },
    }),
  ],
})
export class RedisCacheModule {}