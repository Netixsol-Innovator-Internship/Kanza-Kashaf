import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body(new ValidationPipe()) dto: RegisterDto) {
    return this.auth.register(dto.name, dto.email, dto.password);
  }

  @Post('verify-otp')
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body(new ValidationPipe()) dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.email, dto.otp, 'verification');
  }

  @Post('resend-otp')
  @ApiBody({ schema: { example: { email: 'john@example.com' } } })
  async resendOtp(@Body('email') email: string) {
    return this.auth.resendOtp(email);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body(new ValidationPipe()) dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiBody({ schema: { example: { refreshToken: 'sample_refresh_token' } } })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.auth.refreshTokens(refreshToken);
  }

  @Post('logout')
  @ApiBody({ schema: { example: { refreshToken: 'sample_refresh_token' } } })
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.auth.logout(refreshToken);
  }

  @Post('request-password-reset')
  @ApiBody({ schema: { example: { email: 'john@example.com' } } })
  async requestPasswordReset(@Body('email') email: string) {
    return this.auth.requestPasswordReset(email);
  }

  @Post('reset-password')
  @ApiBody({
    schema: {
      example: {
        email: 'john@example.com',
        code: '123456',
        newPassword: 'NewPass@123',
      },
    },
  })
  async resetPassword(@Body() body: { email: string; code: string; newPassword: string }) {
    return this.auth.resetPassword(body.email, body.code, body.newPassword);
  }
}
