import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationsGateway } from './notifications.gateway';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { Role } from '../../schemas/user.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('NotificationsService');

  constructor(
    @InjectModel(Notification.name) private notifModel: Model<NotificationDocument>,
    private gateway: NotificationsGateway,
  ) {}

  /**
   * Create notification document and emit via gateway.
   * - if userId provided -> emit to that user
   * - else if targetRole provided -> emit to that role
   * - else -> broadcast
   *
   * Also emits both a generic 'notification' event and specific event (type).
   */
  private async createAndEmit(
    type: string,
    message: string,
    userId?: Types.ObjectId | string,
    targetRole?: Role,
  ) {
    const doc = await this.notifModel.create({
      type,
      message,
      user: userId ? (typeof userId === 'string' ? new Types.ObjectId(userId) : userId) : null,
      targetRole: targetRole || Role.USER,
      read: false,
    });

    const payload = doc.toObject();

    try {
      if (userId) {
        const idStr = typeof userId === 'string' ? userId : userId.toString();
        // legacy specific event + generic 'notification'
        this.gateway.sendToUser(idStr, `notification`, payload);
        this.gateway.sendToUser(idStr, `${type}`, payload);
      } else if (targetRole) {
        this.gateway.sendToRole(targetRole, `notification`, payload);
        this.gateway.sendToRole(targetRole, `${type}`, payload);
      } else {
        this.gateway.broadcast('notification', payload);
        this.gateway.broadcast(type, payload);
      }
    } catch (err) {
      this.logger.error('Emit failed', err);
    }

    return doc;
  }

  // --- Predefined helpers ---

  async sendOtpNotification(userId: Types.ObjectId, email: string) {
    return this.createAndEmit('OTP_SENT', 'OTP sent successfully!', userId, Role.USER);
  }

  async sendUserNotification(userId: string, type: string, message: string) {
    return this.createAndEmit(type, message, new Types.ObjectId(userId), Role.USER);
  }

  async sendProfileUpdatedNotification(userId: string) {
    return this.createAndEmit('PROFILE_UPDATED', 'Your profile has been updated', userId, Role.USER);
  }

  async sendNewArrivalNotification(productId: string, productName: string) {
    const msg = `New arrival: ${productName}`;
    return this.createAndEmit('NEW_ARRIVAL', msg, undefined, Role.USER);
  }

  async sendSaleStartNotificationForProduct(productId: string, productName: string, percent: number) {
    const msg = `Sale started for ${productName}: ${percent}% off`;
    return this.createAndEmit('SALE_STARTED', msg, undefined, Role.USER);
  }

  async sendSaleEndNotificationForProduct(productId: string, productName: string) {
    const msg = `Sale ended for ${productName}`;
    return this.createAndEmit('SALE_ENDED', msg, undefined, Role.USER);
  }

  async sendProductSoldOutNotification(productId: string, productName: string, variant?: string, size?: string) {
    const variantInfo = variant ? ` variant:${variant}` : '';
    const sizeInfo = size ? ` size:${size}` : '';
    const msg = `Product sold out: ${productName}${variantInfo}${sizeInfo}`;
    // send to both Admin and Super Admin as separate notifications
    await this.createAndEmit('PRODUCT_SOLD_OUT', msg, undefined, Role.ADMIN);
    return this.createAndEmit('PRODUCT_SOLD_OUT', msg, undefined, Role.SUPER_ADMIN);
  }

  async sendOutOfStockNotification(userId: string, productName: string, variant?: string, size?: string) {
    const variantInfo = variant ? ` variant:${variant}` : '';
    const sizeInfo = size ? ` size:${size}` : '';
    const msg = `Product is out of stock: ${productName}${variantInfo}${sizeInfo}`;
    return this.createAndEmit('OUT_OF_STOCK', msg, new Types.ObjectId(userId), Role.USER);
  }

  async sendPaymentAcceptedNotification(userId: string, orderId?: string) {
    const msg = orderId ? `Payment accepted for order ${orderId}` : 'Payment accepted';
    return this.createAndEmit('PAYMENT_ACCEPTED', msg, new Types.ObjectId(userId), Role.USER);
  }

  // existing helpers
  async sendRoleChangeNotification(userId: Types.ObjectId, newRole: Role) {
    return this.createAndEmit('ROLE_CHANGE', `Your role changed to ${newRole}`, userId, newRole);
  }

  async sendBlockedNotification(userId: Types.ObjectId) {
    return this.createAndEmit('BLOCKED', 'Your account has been blocked by an admin.', userId, Role.USER);
  }

  // queries
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
    return this.notifModel
      .find({
        $or: [{ user: userId }, { targetRole: role }],
      })
      .sort({ createdAt: -1 });
  }
}
