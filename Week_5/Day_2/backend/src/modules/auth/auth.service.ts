import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async signup(username: string, email: string, password: string) {
    const user = await this.users.createUser(username, email, password);
    return this.tokenize(user.id, user.username);
  }

  async login(emailOrUsername: string, password: string) {
    let user = await this.users.findByEmail(emailOrUsername);
    if (!user) user = await this.users.findByUsername(emailOrUsername);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.tokenize(user.id, user.username);
  }

  tokenize(userId: string, username: string) {
    const accessToken = this.jwt.sign({ sub: userId, username }, { secret: process.env.JWT_SECRET, expiresIn: '7d' });
    return { accessToken };
  }
}