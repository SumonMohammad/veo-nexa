import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HmacAuthMiddleware } from './common/middleware/hmac-auth.middleware';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.use(new HmacAuthMiddleware().use);
  await app.listen(3000);
}
bootstrap();