import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'chain-agent-nestjs',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}