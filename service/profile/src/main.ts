import "./config";
import { NestFactory } from "@nestjs/core";

import { ValidationPipe } from "@nestjs/common";
import { ProfileModule } from "@profile/profile.module";


async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(3000);
}

bootstrap().then(r => console.log("Auth service is running"));
