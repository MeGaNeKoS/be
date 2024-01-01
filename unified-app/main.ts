import "./config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Adjust the path as needed

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000); // Or any other port you prefer
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
