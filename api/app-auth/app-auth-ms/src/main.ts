import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {

  const port = parseInt(process.env.PORT);
  const host = process.env.HOST;

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host,
      port
    }
  });

  await app.listen();
}
bootstrap();
