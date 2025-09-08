import { NotificationsService } from '../notifications/notifications.service';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';
import { OtpDocument } from '../../schemas/otp.schema';
import { MailerService } from './mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private userModel;
    private otpModel;
    private mailer;
    private jwt;
    private config;
    private notifications;
    constructor(userModel: Model<UserDocument>, otpModel: Model<OtpDocument>, mailer: MailerService, jwt: JwtService, config: ConfigService, notifications: NotificationsService);
    private genOtpCode;
    private hashCode;
    register(name: string, email: string, password: string): Promise<{
        userId: any;
        message: string;
    }>;
    createAndSendOtp(userId: any, email: string, type: 'verification' | 'password_reset'): Promise<boolean>;
    verifyOtp(email: string, code: string, type: 'verification' | 'password_reset'): Promise<{
        verified: boolean;
        ok?: undefined;
    } | {
        ok: boolean;
        verified?: undefined;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    createTokenPair(user: UserDocument): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    requestPasswordReset(email: string): Promise<{
        ok: boolean;
    }>;
    resetPassword(email: string, code: string, newPassword: string): Promise<{
        ok: boolean;
    }>;
    resendOtp(email: string): Promise<boolean>;
}
