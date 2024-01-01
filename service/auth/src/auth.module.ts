import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "@shared/guard/jwt.strategy";
import { MongodbDatabaseModule } from "@shared/database/mongodb";
import { User } from "@shared/model/user.model";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { JwtAuthGuard } from "@shared/guard/jwt-auth.guard";
import { TokenService } from "@shared/guard/token.service";

@Module({
  imports: [
    MongodbDatabaseModule,
    TypegooseModule.forFeature([User]),
    PassportModule.register({defaultStrategy: "jwt"}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const jwtSecret = configService.get<string>("JWT_SECRET");
        const jwtExpiresIn = configService.get<string>("JWT_EXPIRES_IN", "30d");

        if (!jwtSecret) {
          throw new Error("JWT_SECRET is not defined in the environment variables.");
        }

        return {
          secret: jwtSecret,
          signOptions: {expiresIn: jwtExpiresIn},
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService, JwtAuthGuard, TokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
}
