export declare class MailerService {
    sendMockEmail(to: string, subject: string, body: string): Promise<{
        success: boolean;
    }>;
}
