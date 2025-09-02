import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    forgot(dto: ForgotPasswordDto): Promise<{
        success: boolean;
    }>;
    reset(dto: ResetPasswordDto): Promise<{
        success: boolean;
        note: string;
    }>;
}
