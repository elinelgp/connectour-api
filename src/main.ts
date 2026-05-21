import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Connectour API')
    .setDescription(
      'Module Booking Request — mise en relation artistes / salles de concert',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Booking Requests')
    .addTag('Venues')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(
    `🚀 Connectour API running on http://localhost:${process.env.PORT ?? 3000}`,
  );
  logger.log(
    `📚 Swagger disponible sur http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

void bootstrap();
