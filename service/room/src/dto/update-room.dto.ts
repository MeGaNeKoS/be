import { IsNotEmpty } from "class-validator";

export class UpdateRoomDto {
  @IsNotEmpty()
  members: string[];
}

