import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estao no dto
      forbidNonWhitelisted: true, // mandar erro quando a chave não existir
      transform: false, // tenta transformar os tipos de dados dos dto
    }),
  );
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.enableCors({
      origin: 'http://meusite.com', // -> frontend
    });
  }

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
