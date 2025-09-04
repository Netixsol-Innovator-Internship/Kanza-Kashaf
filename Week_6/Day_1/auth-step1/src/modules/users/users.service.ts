import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notifications: NotificationsService,
  ) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel
      .findById(id)
      .select(
        '-password -refreshTokenHash -blocked -isEmailVerified -role',
      );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // ✅ Password update flow
    if (dto.newPassword) {
      if (!dto.oldPassword) {
        throw new BadRequestException(
          'Old password is required to set a new password',
        );
      }

      const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Old password is incorrect');
      }

      if (dto.newPassword.length < 6) {
        throw new BadRequestException(
          'New password must be at least 6 characters long',
        );
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(dto.newPassword, salt);
    }

    if (dto.name) user.name = dto.name;
    if (dto.addresses) user.addresses = dto.addresses;

    await user.save();

    // 🔔 Send profile-updated notification to actor user
    try {
      await this.notifications.sendProfileUpdatedNotification(userId);
    } catch (e) {
      console.error(
        'Failed to send profile updated notification',
        e,
      );
    }

    // return safe object
    return await this.userModel
      .findById(userId)
      .select(
        '-password -refreshTokenHash -blocked -isEmailVerified -role',
      );
  }
}
