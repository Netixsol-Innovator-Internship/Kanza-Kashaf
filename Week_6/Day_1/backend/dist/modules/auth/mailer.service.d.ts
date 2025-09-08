import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private config;
    private transporter;
    private logger;
    constructor(config: ConfigService);
    sendOtpEmail(to: string, otp: string, type: 'verification' | 'password_reset'): Promise<void>;
}
