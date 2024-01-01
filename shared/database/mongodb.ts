import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from "@m8a/nestjs-typegoose";


@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: "mongodb+srv://testing:qKMTN3EsTYeI6YS0@cluster0.1a6fi98.mongodb.net/?retryWrites=true&w=majority"
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypegooseModule],
})
export class MongodbDatabaseModule {}
