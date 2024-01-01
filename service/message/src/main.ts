import "./config";
import { NestFactory } from "@nestjs/core";

import { ValidationPipe } from "@nestjs/common";
import { MessageModule } from "@/message/src/message.module";

async function bootstrap() {
  const app = await NestFactory.create(MessageModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(3000);
}

bootstrap().then(r => console.log("Message service is running"));
