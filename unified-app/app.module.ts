import { Module } from '@nestjs/common';
import { AuthModule } from "@auth/auth.module";
import { MessageModule } from "@/message/src/message.module";
import { ProfileModule } from "@profile/profile.module";
import { RoomModule } from "@/room/src/room.module";


@Module({
  imports: [AuthModule, MessageModule, ProfileModule, RoomModule],

})
export class AppModule {}
