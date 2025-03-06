import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 4399);

}
bootstrap();

console.log(process.env.RADIS_HOST);
console.log(process.env.RADIS_PORT)
  console.log(process.env.RADIS_PWD) 
  console.log(parseInt(process.env.RADIS_PORT!));
  


