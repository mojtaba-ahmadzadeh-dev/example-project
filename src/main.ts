import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerConfigInit } from './config/swagger.config';
import { AppModule } from './module/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  SwaggerConfigInit(app)
  const port = configService.get<number>('PORT') ?? 3000;
  const env = configService.get<string>('NODE_ENV') ?? 'development';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}/swagger`);
  console.log(`🌍 Environment: ${env.toUpperCase()}`);
}

bootstrap();