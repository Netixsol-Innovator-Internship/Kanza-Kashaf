import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class SignupDto {
  @IsNotEmpty() username: string;
  @IsEmail() email: string;
  @MinLength(6) password: string;
}
class LoginDto {
  @IsNotEmpty() identifier: string;
  @IsNotEmpty() password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto.username, dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.identifier, dto.password);
  }
}