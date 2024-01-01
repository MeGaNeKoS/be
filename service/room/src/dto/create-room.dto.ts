import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  members: string[];
}

