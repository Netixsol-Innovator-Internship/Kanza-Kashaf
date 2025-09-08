// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const frontendOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',');
  app.enableCors({
    origin: frontendOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
  });

  const config = new DocumentBuilder()
    .setTitle('Ecom Auth Step1')
    .setDescription('Auth + OTP + Users & RBAC')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'jwt', // 👈 key
    )
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const port = parseInt(process.env.PORT || '5000', 10);
  await app.listen(port);
  Logger.log(`App listening on http://localhost:${port}`);
  Logger.log(`Swagger available at http://localhost:${port}/api`);
}
bootstrap();
