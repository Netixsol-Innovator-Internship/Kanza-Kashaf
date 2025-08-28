import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const PORT = process.env.PORT || 4000;
  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin,
    credentials: true,
    exposedHeaders: ['Authorization']
  });
  await app.listen(PORT);
  console.log(`API listening on http://localhost:${PORT}`);
}
bootstrap();
