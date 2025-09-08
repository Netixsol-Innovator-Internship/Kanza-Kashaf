import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { Otp, OtpDocument } from '../../schemas/otp.schema';
import * as crypto from 'crypto';
import { MailerService } from './mailer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private mailer: MailerService,
    private jwt: JwtService,
    private config: ConfigService,
    private notifications: NotificationsService,
  ) {}

  private genOtpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit string
  }

  private hashCode(code: string) {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  async register(name: string, email: string, password: string) {
    email = email.toLowerCase();
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email already registered');

    const user = new this.userModel({ name, email, password });
    await user.save();

    // create OTP
    await this.createAndSendOtp(user._id, email, 'verification');
    return { userId: user._id, message: 'OTP sent to email' };
  }

  async createAndSendOtp(userId: any, email: string, type: 'verification' | 'password_reset') {
    // rate limits: max 5 per 24 hours, cooldown 60s
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await this.otpModel.countDocuments({ user: userId, createdAt: { $gte: oneDayAgo } });
    if (count >= 5) throw new ForbiddenException('OTP resend limit reached for today');

    const last = await this.otpModel.findOne({ user: userId }).sort({ createdAt: -1 });
    if (last && (Date.now() - last.createdAt.getTime()) < 60_000) throw new ForbiddenException('Please wait before requesting a new OTP');

    const code = this.genOtpCode();
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.otpModel.create({ user: userId, codeHash, type, expiresAt, attempts: 0 });
    await this.mailer.sendOtpEmail(email, code, type);
    await this.notifications.sendOtpNotification(userId);
    return true;
  }

  async verifyOtp(email: string, code: string, type: 'verification' | 'password_reset') {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');

    const otpDoc = await this.otpModel.findOne({ user: user._id, type }).sort({ createdAt: -1 });
    if (!otpDoc) throw new BadRequestException('No OTP found. Request a new one.');

    if (otpDoc.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired. Request a new one.');
    }

    if (otpDoc.attempts >= 5) throw new BadRequestException('OTP attempts exceeded');

    const codeHash = this.hashCode(code);
    if (codeHash !== otpDoc.codeHash) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      throw new BadRequestException('Invalid OTP');
    }

    // success
    await this.otpModel.deleteMany({ user: user._id, type });

    if (type === 'verification') {
      user.isEmailVerified = true;
      await user.save();
      return { verified: true };
    }

    return { ok: true };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new NotFoundException('Invalid credentials');

    if (user.blocked) throw new ForbiddenException('User is blocked');
    if (!user.isEmailVerified) throw new ForbiddenException('Email not verified');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new BadRequestException('Invalid credentials');

    return this.createTokenPair(user);
  }

  async createTokenPair(user: UserDocument) {
    const payload = { sub: user._id.toString(), role: user.role, email: user.email };

    const access = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET') || 'changeme_super_secret',
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES') || '15m',
    });
    const refresh = await this.jwt.signAsync({ sub: user._id.toString() }, {
      secret: this.config.get('JWT_REFRESH_SECRET') || 'changeme_refresh_secret',
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES') || '7d',
    });

    // store hashed refresh token
    const refreshHash = crypto.createHash('sha256').update(refresh).digest('hex');
    user.refreshTokenHash = refreshHash;
    await user.save();

    return { accessToken: access, refreshToken: refresh };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload: any = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') || 'changeme_refresh_secret' });
      const user = await this.userModel.findById(payload.sub);
      if (!user) throw new ForbiddenException();

      const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      if (user.refreshTokenHash !== hash) throw new ForbiddenException();

      return this.createTokenPair(user);
    } catch (err) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const payload: any = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') || 'changeme_refresh_secret' });
      const user = await this.userModel.findById(payload.sub);
      if (!user) return;
      user.refreshTokenHash = null;
      await user.save();
    } catch (err) {
      // ignore
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');
    await this.createAndSendOtp(user._id, user.email, 'password_reset');
    return { ok: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    // verify OTP of type password_reset
    await this.verifyOtp(email, code, 'password_reset');
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    user.password = newPassword;
    await user.save();
    // invalidate refresh tokens
    user.refreshTokenHash = null;
    await user.save();
    return { ok: true };
  }

  // helper used by controller resend
  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new NotFoundException('User not found');
    return this.createAndSendOtp(user._id, user.email, 'verification');
  }
}
