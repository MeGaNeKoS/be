import { IsDate, IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateProfileDto {

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsString()
  @IsOptional()
  gender?: string;
}
