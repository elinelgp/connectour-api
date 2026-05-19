import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Swagger ────────────────────────────────────────────────────────────────
  // Justification métier : documentation vivante des contrats d'API,
  // consultable par les futurs intégrateurs (frontend, partenaires).
  const config = new DocumentBuilder()
    .setTitle('Connectour API')
    .setDescription(
      'Module Booking Request — mise en relation artistes / salles de concert',
    )
    .setVersion('0.1.0')
    .addTag('Booking Requests')
    .addTag('Venues')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ──────────────────────────────────────────────────────────────────────────

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Connectour API running on http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger disponible sur http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

void bootstrap();
