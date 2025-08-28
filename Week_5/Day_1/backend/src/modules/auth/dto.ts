import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty() username: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;
}

export class LoginDto {
  @IsNotEmpty() identifier: string; // email or username
  @MinLength(6) password: string;
}
