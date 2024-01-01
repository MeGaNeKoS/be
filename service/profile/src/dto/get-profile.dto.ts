import { IsNotEmpty } from 'class-validator';

export class GetProfileDto {
  @IsNotEmpty()
  userId: string;
}
