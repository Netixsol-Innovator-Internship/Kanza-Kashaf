import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private users: UsersService) {}

  sign(user: any) {
    const payload = { userId: user._id.toString(), username: user.username };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  }

  async register(username: string, email: string, password: string) {
    const user = await this.users.create(username, email, password);
    const token = this.sign(user);
    return { token, user: { id: user._id, username: user.username, email: user.email } };
  }

  async login(identifier: string, password: string) {
    const user = await this.users.validate(identifier, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const token = this.sign(user);
    return { token, user: { id: user._id, username: user.username, email: user.email } };
  }
}
