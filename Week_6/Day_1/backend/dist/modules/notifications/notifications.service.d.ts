import { Model, Types } from 'mongoose';
import { NotificationsGateway } from './notifications.gateway';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { Role, UserDocument } from '../../schemas/user.schema';
export declare class NotificationsService {
    private notifModel;
    private userModel;
    private gateway;
    private readonly logger;
    constructor(notifModel: Model<NotificationDocument>, userModel: Model<UserDocument>, gateway: NotificationsGateway);
    private createAndEmit;
    emitEvent(eventName: string, payload: any): Promise<void>;
    sendOtpNotification(userId: Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    sendUserNotification(userId: string, type: string, message: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    sendProfileUpdatedNotification(userId: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    sendNewArrivalNotification(productId: string, productName: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    sendSaleStartNotificationForProduct(productId: string, productName: string, percent: number): Promise<any>;
    sendSaleEndNotificationForProduct(productId: string, productName: string): Promise<any>;
    sendSaleStartGlobal(campaignName: string, percent: number): Promise<any>;
    sendSaleEndGlobal(campaignName: string): Promise<any>;
    sendProductSoldOutNotification(productId: string, productName: string, variant?: string, size?: string): Promise<void>;
    sendOutOfStockNotification(userId: string, productName: string, variant?: string, size?: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    sendPaymentAcceptedNotification(userId: string, orderId?: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    sendRoleChangeNotification(userId: Types.ObjectId, newRole: Role): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    sendBlockedNotification(userId: Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    findAll(): Promise<Omit<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }, never>[]>;
    findUserNotifications(userId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    })[]>;
    findSuperAdminNotifications(): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    })[]>;
    markAsRead(id: string): Promise<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    findUserAndRoleNotifications(userId: string, role: Role): Promise<(import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    })[]>;
}
