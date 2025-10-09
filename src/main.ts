import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non autorisés
      forbidNonWhitelisted: true, // retourne une erreur si un champ non autorisé est présent
      transform: true, // transforme automatiquement les données en fonction des types de la classe fourinie comme dto
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
