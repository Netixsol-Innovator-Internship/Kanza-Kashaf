// notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notification.schema';
import { WsGateway } from '../../ws/ws.gateway';
import { UsersService } from '../users/users.service'; // <-- new

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly model: Model<Notification>,
    private readonly ws: WsGateway,
    private readonly usersService: UsersService, // <-- injected
  ) {}

  async countUnread(userId: string) {
    return this.model.countDocuments({ userId, read: false });
  }

  async delete(userId: string, id: string) {
    const notif = await this.model.findOneAndDelete({ _id: id, userId });
    if (notif) {
      this.ws.emitToUser(userId, 'notification.deleted', { id }); // emit delete
    }
    return notif;
  }

  // create: still persists the notification, but when emitting include actorDisplayName
  async create(data: Partial<Notification>) {
    const doc = new this.model(data);
    await doc.save();

    // try to resolve actor display name (best-effort)
    let actorDisplayName: string | null = null;
    if (doc.actorId) {
      try {
        const user = await this.usersService.findById(doc.actorId);
        actorDisplayName = user?.displayName || user?.username || null;
      } catch (err) {
        actorDisplayName = null;
      }
    }

    // emit payload includes actorDisplayName so subscribers (toasts) can show name without extra fetch
    const emitted = { ...(doc.toObject ? doc.toObject() : doc), actorDisplayName };
    this.ws.emitToUser(doc.userId, 'notification.new', emitted);
    return doc;
  }

  // listForUser: return notifications with actorDisplayName property (best-effort resolution)
  async listForUser(userId: string) {
    const notifs = await this.model.find({ userId }).sort({ createdAt: -1 }).limit(200);

    // Resolve actor names (best-effort)
    const results = await Promise.all(
      notifs.map(async (n) => {
        let actorDisplayName: string | null = null;
        if (n.actorId) {
          try {
            const user = await this.usersService.findById(n.actorId);
            actorDisplayName = user?.displayName || user?.username || null;
          } catch (_) {
            actorDisplayName = null;
          }
        }
        return {
          ...(n.toObject ? n.toObject() : n),
          actorDisplayName,
        };
      }),
    );

    return results;
  }

  async markRead(userId: string, id: string) {
    const notif = await this.model.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true },
    );
    if (notif) {
      this.ws.emitToUser(userId, 'notification.read', { id }); // emit read
    }
    return notif;
  }
}
