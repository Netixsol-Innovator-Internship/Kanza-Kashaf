import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailerService } from './mailer.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { Otp, OtpSchema } from '../../schemas/otp.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtStrategy } from './guards/jwt.strategy';   // 👈 add this import

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),   // 👈 register passport with jwt
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'changeme_super_secret',
        signOptions: { expiresIn: config.get<string>('JWT_ACCESS_EXPIRES') || '15m' },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    NotificationsModule,
  ],
  providers: [
    AuthService,
    MailerService,
    JwtStrategy,   // 👈 register JwtStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
