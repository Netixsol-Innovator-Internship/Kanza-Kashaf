import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async me(userId: string) {
    return this.userModel.findById(userId)
      .populate({
        path: 'myCars',
        model: 'Auction',
        select: 'make carModel year minBid currentPrice totalBids photos status endTime winnerId',
      })
      .populate({
        path: 'myBids',
        model: 'Auction',
        select: 'make carModel year minBid currentPrice totalBids photos status endTime winnerId',
      })
      .populate({
        path: 'wishlist',
        model: 'Auction',
        select: 'make carModel year minBid currentPrice totalBids photos status endTime',
      });
  }


  async update(userId: string, dto: UpdateUserDto) {
    const u = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: dto }, // ensure only provided fields are updated
      { new: true }
    );
    if (!u) throw new NotFoundException('User not found');
    return u;
  }
}
