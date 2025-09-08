import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        userId: any;
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        verified: boolean;
        ok?: undefined;
    } | {
        ok: boolean;
        verified?: undefined;
    }>;
    resendOtp(email: string): Promise<boolean>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    requestPasswordReset(email: string): Promise<{
        ok: boolean;
    }>;
    resetPassword(body: {
        email: string;
        code: string;
        newPassword: string;
    }): Promise<{
        ok: boolean;
    }>;
}
