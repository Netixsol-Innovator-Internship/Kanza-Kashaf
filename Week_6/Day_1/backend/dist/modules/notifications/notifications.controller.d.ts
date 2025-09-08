import { NotificationsService } from './notifications.service';
import { Request } from 'express';
import { Notification } from '../../schemas/notification.schema';
declare module 'express' {
    interface Request {
        user?: any;
    }
}
export declare class NotificationsController {
    private notifications;
    constructor(notifications: NotificationsService);
    getMyNotifications(req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/notification.schema").NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getSuperAdminNotifs(): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/notification.schema").NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getUserNotifications(userId: string, req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/notification.schema").NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    markAsRead(id: string, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/notification.schema").NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
