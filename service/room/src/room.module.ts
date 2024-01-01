import { Module } from "@nestjs/common";


import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Room } from "@shared/model/message.model";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { User } from "@shared/model/user.model";

import { RoomService } from "@/room/src/room.service";
import { RoomController } from "@/room/src/room.controller";
import { MongodbDatabaseModule } from "@shared/database/mongodb";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "@shared/guard/jwt.strategy";
import { JwtAuthGuard } from "@shared/guard/jwt-auth.guard";
import { TokenService } from "@shared/guard/token.service";

@Module({
  imports: [
    MongodbDatabaseModule,
    TypegooseModule.forFeature([Room, User]),
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
  providers: [JwtStrategy, RoomService, JwtAuthGuard, TokenService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {
}
