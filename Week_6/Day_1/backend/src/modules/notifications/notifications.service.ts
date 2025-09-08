import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationsGateway } from './notifications.gateway';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { Role, User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('NotificationsService');

  constructor(
    @InjectModel(Notification.name) private notifModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private gateway: NotificationsGateway,
  ) {}

  /**
   * Core method: persists a notification and emits it via socket
   */
  private async createAndEmit(
    type: string,
    message: string,
    userId?: Types.ObjectId | string,
    targetRole?: Role,
  ) {
    let resolvedTargetRole: Role | undefined = targetRole;

    // derive role if only userId provided
    if (!resolvedTargetRole && userId) {
      try {
        const user = await this.userModel.findById(
          typeof userId === 'string' ? new Types.ObjectId(userId) : userId,
        );
        if (user) resolvedTargetRole = user.role;
      } catch {
        this.logger.warn(`Could not resolve role for notification: ${type}`);
      }
    }

    const doc = await this.notifModel.create({
      type,
      message,
      user: userId
        ? typeof userId === 'string'
          ? new Types.ObjectId(userId)
          : userId
        : null,
      targetRole: resolvedTargetRole, // ❌ removed default Role.USER to avoid duplication
      read: false,
    });

    const payload = doc.toObject();

    try {
      if (userId) {
        const idStr = typeof userId === 'string' ? userId : userId.toString();
        this.gateway.sendToUser(idStr, 'notification', payload);
      } else if (targetRole) {
        this.gateway.sendToRole(targetRole, 'notification', payload);
      } else {
        this.gateway.broadcast('notification', payload);
      }
    } catch (err) {
      this.logger.error('Emit failed', err);
    }

    return doc;
  }

  /**
   * Generic realtime broadcast (no DB persistence)
   * Example: refreshing product list after update
   */
  async emitEvent(eventName: string, payload: any) {
    try {
      this.gateway.broadcast(eventName, payload);
    } catch (e) {
      this.logger.error('emitEvent failed', e);
    }
  }

  // ------------------- Notification helpers -------------------

  async sendOtpNotification(userId: Types.ObjectId) {
    return this.createAndEmit('OTP_SENT', 'OTP sent successfully!', userId);
  }

  async sendUserNotification(userId: string, type: string, message: string) {
    return this.createAndEmit(type, message, new Types.ObjectId(userId));
  }

  async sendProfileUpdatedNotification(userId: string) {
    const notif = await this.createAndEmit(
      'PROFILE_UPDATED',
      'Your profile has been updated',
      userId,
    );
    this.emitEvent('PROFILE_UPDATED', { userId });
    return notif;
  }

  async sendNewArrivalNotification(productId: string, productName: string) {
    const notif = await this.createAndEmit(
      'NEW_ARRIVAL',
      `New arrival: ${productName}`,
      undefined,
      Role.USER,
    );
    // Also notify admins
    await this.createAndEmit('NEW_ARRIVAL', `New arrival: ${productName}`, undefined, Role.ADMIN);
    await this.createAndEmit('NEW_ARRIVAL', `New arrival: ${productName}`, undefined, Role.SUPER_ADMIN);

    this.emitEvent('NEW_ARRIVAL', { productName });
    return notif;
  }

  async sendSaleStartNotificationForProduct(productId: string, productName: string, percent: number) {
    // Persist two role-targeted notifications (USER and ADMIN) so both audiences see it in their lists
    await this.createAndEmit('SALE_STARTED', `Sale started for ${productName}: ${percent}% off`, undefined, Role.USER);
    await this.createAndEmit('SALE_STARTED', `Sale started for ${productName}: ${percent}% off`, undefined, Role.ADMIN);
    await this.createAndEmit('SALE_STARTED', `Sale started for ${productName}: ${percent}% off`, undefined, Role.SUPER_ADMIN);
    this.emitEvent('SALE_STARTED', { productId, productName, percent });
    // No single doc to return when multiple are created
    return { ok: true } as any;
  }

  async sendSaleEndNotificationForProduct(productId: string, productName: string) {
    await this.createAndEmit('SALE_ENDED', `Sale ended for ${productName}`, undefined, Role.USER);
    await this.createAndEmit('SALE_ENDED', `Sale ended for ${productName}`, undefined, Role.ADMIN);
    await this.createAndEmit('SALE_ENDED', `Sale ended for ${productName}`, undefined, Role.SUPER_ADMIN);
    this.emitEvent('SALE_ENDED', { productId, productName });
    return { ok: true } as any;
  }

  // Global sale notifications (campaign-level)
  async sendSaleStartGlobal(campaignName: string, percent: number) {
    const msg = `Sale started: ${campaignName} - ${percent}% off`;
    await this.createAndEmit('SALE_STARTED', msg, undefined, Role.USER);
    await this.createAndEmit('SALE_STARTED', msg, undefined, Role.ADMIN);
    await this.createAndEmit('SALE_STARTED', msg, undefined, Role.SUPER_ADMIN);
    this.emitEvent('SALE_STARTED_GLOBAL', { campaignName, percent });
    return { ok: true } as any;
  }

  async sendSaleEndGlobal(campaignName: string) {
    const msg = `Sale ended: ${campaignName}`;
    await this.createAndEmit('SALE_ENDED', msg, undefined, Role.USER);
    await this.createAndEmit('SALE_ENDED', msg, undefined, Role.ADMIN);
    await this.createAndEmit('SALE_ENDED', msg, undefined, Role.SUPER_ADMIN);
    this.emitEvent('SALE_ENDED_GLOBAL', { campaignName });
    return { ok: true } as any;
  }

  async sendProductSoldOutNotification(productId: string, productName: string, variant?: string, size?: string) {
    const variantInfo = variant ? ` variant:${variant}` : '';
    const sizeInfo = size ? ` size:${size}` : '';
    const msg = `Product sold out: ${productName}${variantInfo}${sizeInfo}`;

    await this.createAndEmit('PRODUCT_SOLD_OUT', msg, undefined, Role.ADMIN);
    await this.createAndEmit('PRODUCT_SOLD_OUT', msg, undefined, Role.SUPER_ADMIN);

    this.emitEvent('PRODUCT_SOLD_OUT', { productId, productName, variant, size });
  }

  async sendOutOfStockNotification(userId: string, productName: string, variant?: string, size?: string) {
    const variantInfo = variant ? ` variant:${variant}` : '';
    const sizeInfo = size ? ` size:${size}` : '';
    const msg = `Product is out of stock: ${productName}${variantInfo}${sizeInfo}`;

    const notif = await this.createAndEmit('OUT_OF_STOCK', msg, new Types.ObjectId(userId));
    this.emitEvent('OUT_OF_STOCK', { productName, variant, size, userId });
    return notif;
  }

  async sendPaymentAcceptedNotification(userId: string, orderId?: string) {
    const msg = orderId ? `Payment accepted for order ${orderId}` : 'Payment accepted';
    const notif = await this.createAndEmit('PAYMENT_ACCEPTED', msg, new Types.ObjectId(userId));
    this.emitEvent('PAYMENT_ACCEPTED', { userId, orderId });
    return notif;
  }

  async sendRoleChangeNotification(userId: Types.ObjectId, newRole: Role) {
    const notif = await this.createAndEmit('ROLE_CHANGE', `Your role changed to ${newRole}`, userId, newRole);
    this.emitEvent('ROLE_CHANGE', { userId, newRole });
    return notif;
  }

  async sendBlockedNotification(userId: Types.ObjectId) {
    const notif = await this.createAndEmit('BLOCKED', 'Your account has been blocked by an admin.', userId, Role.USER);
    this.emitEvent('BLOCKED', { userId });
    return notif;
  }

  // ------------------- Queries -------------------

  async findAll() {
    return this.notifModel.find().populate('user').sort({ createdAt: -1 });
  }

  async findUserNotifications(userId: string) {
    return this.notifModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findSuperAdminNotifications() {
    return this.notifModel.find({ targetRole: Role.SUPER_ADMIN }).sort({ createdAt: -1 });
  }

  async markAsRead(id: string) {
    return this.notifModel.findByIdAndUpdate(id, { read: true }, { new: true });
  }

  async findUserAndRoleNotifications(userId: string, role: Role) {
    return this.notifModel.find({
      $or: [{ user: userId }, { targetRole: role }],
    }).sort({ createdAt: -1 });
  }
}
