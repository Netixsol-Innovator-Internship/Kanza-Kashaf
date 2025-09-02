import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { User } from '../schemas/user.schema';
import { WsGateway } from '../ws/ws.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly ws: WsGateway,
  ) {}

  // ----- Create & emit -----
  async create(userId: string | Types.ObjectId, type: string, data: any) {
    const uid = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const doc = await this.notificationModel.create({ userId: uid, type, data });
    // push realtime to that user
    this.ws.emitToUser(uid.toString(), 'notification:new', this.serialize(doc));
    return doc;
  }

  async createForUsers(userIds: Array<string | Types.ObjectId>, type: string, data: any) {
    const unique = Array.from(new Set(userIds.map((id) => id.toString())));
    if (!unique.length) return [];

    const docs = await this.notificationModel.insertMany(
      unique.map((id) => ({ userId: new Types.ObjectId(id), type, data })),
      { ordered: false },
    );

    // emit one-by-one so each user’s room gets its own payload
    for (const d of docs) {
      this.ws.emitToUser(d.userId.toString(), 'notification:new', this.serialize(d as any));
    }
    return docs;
  }

  async createForAll(type: string, data: any) {
    const users = await this.userModel.find({}, { _id: 1 }).lean();
    if (!users.length) return [];
    const docs = await this.notificationModel.insertMany(
      users.map((u) => ({ userId: u._id, type, data })),
      { ordered: false },
    );
    for (const d of docs) {
      this.ws.emitToUser(d.userId.toString(), 'notification:new', this.serialize(d as any));
    }
    return docs;
  }

  // ----- Queries -----
  async list(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async unreadCount(userId: string) {
    return this.notificationModel.countDocuments({ userId, read: false });
  }

  async markRead(id: string, userId?: string) {
    const q: any = { _id: id };
    if (userId) q.userId = userId;
    const updated = await this.notificationModel.findOneAndUpdate(q, { read: true }, { new: true });
    if (updated) {
      this.ws.emitToUser(updated.userId.toString(), 'notification:updated', this.serialize(updated));
    }
    return updated;
  }

  async markAllRead(userId: string) {
    await this.notificationModel.updateMany({ userId, read: false }, { read: true });
    this.ws.emitToUser(userId, 'notification:mark_all_read', { userId });
    return { ok: true };
  }

  private serialize(n: any) {
    return {
      _id: n._id.toString(),
      userId: n.userId.toString(),
      type: n.type,
      data: n.data,
      read: n.read,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    };
  }
}
