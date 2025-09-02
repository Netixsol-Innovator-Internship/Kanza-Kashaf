import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  async sendMockEmail(to: string, subject: string, body: string) {
    // In real systems, integrate provider. Here we just log.
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${body}`);
    return { success: true };
  }
}
