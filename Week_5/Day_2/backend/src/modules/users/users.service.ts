import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { WsGateway } from '../../ws/ws.gateway';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly ws: WsGateway,
  ) {}

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async createUser(username: string, email: string, password: string) {
    const usernameTrimmed = username.trim();
    const usernameLower = usernameTrimmed.toLowerCase();
    const exists = await this.userModel.findOne({ $or: [{ email }, { username: usernameLower }] });
    if (exists) throw new BadRequestException('User already exists');
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username: usernameLower,
      displayName: usernameTrimmed,
      email,
      password: hash
    });
    return user.save();
  }

  async publicProfile(user: User, currentUserId?: string, includeIsFollowing = true) {
    if (!user) throw new NotFoundException('User not found');
    const obj = user.toObject();
    delete obj.password;

    obj.followersCount = user.followers.length;
    obj.followingCount = user.following.length;

    if (includeIsFollowing && currentUserId) {
      obj.isFollowing = user.followers.some((id) => id.toString() === currentUserId);
    }

    return obj;
  }


  async updateProfile(userId: string, data: { bio?: string; profilePic?: string }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.profilePic !== undefined) user.profilePic = data.profilePic;
    await user.save();
    const pub = await this.publicProfile(user);

    this.ws.emitToUser(userId, 'profile:update', pub);
    this.ws.emitToAllExceptActor('profile:update', pub, userId);

    return pub;
  }

  async follow(userId: string, targetId: string) {
    if (userId === targetId) throw new BadRequestException('Cannot follow yourself');
    const user = await this.userModel.findById(userId);
    const target = await this.userModel.findById(targetId);
    if (!user || !target) throw new NotFoundException('User not found');

    if (!user.following.includes(targetId)) {
      user.following.push(targetId);
      target.followers.push(userId);
      await user.save();
      await target.save();
    }

    const me = await this.publicProfile(user, userId);
    const targetForMe = await this.publicProfile(target, userId);
    const targetForOthers = await this.publicProfile(target, undefined, false);

    this.ws.emitToUser(userId, 'profile:update', me);
    this.ws.emitToUser(userId, 'profile:update', targetForMe);

    this.ws.emitToUser(targetId, 'profile:update', {
      ...(await this.publicProfile(target, targetId)),
    });

    this.ws.emitToAllExceptActor('profile:update', targetForOthers, userId);
  }

  async unfollow(userId: string, targetId: string) {
    const user = await this.userModel.findById(userId);
    const target = await this.userModel.findById(targetId);
    if (!user || !target) throw new NotFoundException('User not found');

    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter((id) => id.toString() !== userId);
    await user.save();
    await target.save();

    const me = await this.publicProfile(user, userId);
    const targetForMe = await this.publicProfile(target, userId);
    const targetForOthers = await this.publicProfile(target, undefined, false);

    this.ws.emitToUser(userId, 'profile:update', me);
    this.ws.emitToUser(userId, 'profile:update', targetForMe);

    this.ws.emitToUser(targetId, 'profile:update', {
      ...(await this.publicProfile(target, targetId)),
    });

    this.ws.emitToAllExceptActor('profile:update', targetForOthers, userId);
  }
}
