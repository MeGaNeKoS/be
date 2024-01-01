import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { StorageService } from "@shared/storage/storage";
import { MongodbDatabaseModule } from "@shared/database/mongodb";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { User } from "@shared/model/user.model";
import { Profile } from "@shared/model/profile.model";
import { JwtStrategy } from "@shared/guard/jwt.strategy";
import { JwtAuthGuard } from "@shared/guard/jwt-auth.guard";
import { TokenService } from "@shared/guard/token.service";

@Module({
  imports: [
    MongodbDatabaseModule,
    TypegooseModule.forFeature([User, Profile]),

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
  controllers: [ProfileController],
  providers: [JwtStrategy, ProfileService, StorageService, JwtAuthGuard, TokenService],
})
export class ProfileModule {
}
