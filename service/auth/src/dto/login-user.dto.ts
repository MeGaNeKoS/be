import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class LoginUserDto {
  @ValidateIf(o => !o.username)
  @IsEmail()
  email?: string;

  @ValidateIf(o => !o.email)
  @IsNotEmpty()
  username?: string;

  @IsNotEmpty()
  password: string;
}
