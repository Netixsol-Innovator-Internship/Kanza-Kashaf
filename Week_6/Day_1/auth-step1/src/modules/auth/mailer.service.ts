import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter;
  private logger = new Logger('MailerService');

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('GMAIL_USER'),
        pass: this.config.get('GMAIL_PASS'),
      },
    });
  }

  async sendOtpEmail(to: string, otp: string, type: 'verification' | 'password_reset') {
    const subject = type === 'verification' ? 'Your verification OTP' : 'Your password reset OTP';
    const html = `<p>Your ${subject}: <strong>${otp}</strong></p><p>It expires in 5 minutes.</p>`;
    await this.transporter.sendMail({
      from: this.config.get('GMAIL_USER'),
      to,
      subject,
      html,
    });
    this.logger.log(`OTP email sent to ${to}`);
  }
}
