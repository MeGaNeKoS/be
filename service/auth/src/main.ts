import "./config";
import { NestFactory } from "@nestjs/core";
import { AuthModule } from "@auth/auth.module";
import { ValidationPipe } from "@nestjs/common";


async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  await app.listen(3000);
}

bootstrap().then(r => console.log("Auth service is running"));
