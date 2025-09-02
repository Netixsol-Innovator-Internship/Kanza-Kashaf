import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailerService } from '../mailer/mailer.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailer: MailerService
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ $or: [{ email: dto.email }, { username: dto.username }] });
    if (exists) throw new BadRequestException('Email or username already exists');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      username: dto.username,
      email: dto.email,
      password: hash,
      fullName: dto.fullName,
      phone: dto.phone
    });

    // Mock email verification
    const token = uuidv4();
    await this.mailer.sendMockEmail(dto.email, 'Verify your account', `Use this token to verify: ${token}`);

    const payload = { sub: user._id.toString(), email: user.email, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
    return { accessToken, user };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user._id.toString(), email: user.email, username: user.username };
    const expiresIn = dto.rememberMe ? '7d' : (process.env.JWT_EXPIRES_IN || '1d');

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn
    });
    return { accessToken, user };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return { success: true }; // don't reveal
    const token = uuidv4();
    await this.mailer.sendMockEmail(email, 'Reset Password', `Use this token to reset: ${token}`);
    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    // Since it's a mock flow, just accept any token and proceed
    const hash = await bcrypt.hash(newPassword, 10);
    // In reality you'd map token to user; here we just no-op
    return { success: true, note: 'Mock reset; implement token-store if needed' };
  }
}
