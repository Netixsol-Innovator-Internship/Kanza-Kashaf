import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const origin = process.env.ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useWebSocketAdapter(new IoAdapter(app));
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
