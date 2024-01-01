import { Module } from "@nestjs/common";

import { MessageService } from "./message.service";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Message, Room } from "@shared/model/message.model";
import { TypegooseModule } from "@m8a/nestjs-typegoose";
import { User } from "@shared/model/user.model";
import { ChatGateway } from "@/message/src/message.gateway";
import { MongodbDatabaseModule } from "@shared/database/mongodb";
import { JwtStrategy } from "@shared/guard/jwt.strategy";
import { JwtAuthGuard } from "@shared/guard/jwt-auth.guard";
import { TokenService } from "@shared/guard/token.service";

@Module({
  imports: [
    MongodbDatabaseModule,
    TypegooseModule.forFeature([Message, Room, User]),
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
  providers: [MessageService, ChatGateway, JwtStrategy, JwtAuthGuard, TokenService],
})
export class MessageModule {
}
