import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '../mailer/mailer.service';
export declare class AuthService {
    private userModel;
    private jwtService;
    private mailer;
    constructor(userModel: Model<User>, jwtService: JwtService, mailer: MailerService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
        note: string;
    }>;
}
