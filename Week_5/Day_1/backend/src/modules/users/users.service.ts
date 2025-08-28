import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(username: string, email: string, password: string) {
    const exists = await this.userModel.findOne({ $or: [{ email }, { username }] });
    if (exists) throw new ConflictException('User already exists');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, email, passwordHash });
    return user.save();
  }

  async validate(emailOrUsername: string, password: string) {
    const user = await this.userModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) throw new NotFoundException('User not found');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }
}
