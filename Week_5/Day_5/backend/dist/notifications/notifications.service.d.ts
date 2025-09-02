import { Model, Types } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { User } from '../schemas/user.schema';
import { WsGateway } from '../ws/ws.gateway';
export declare class NotificationsService {
    private notificationModel;
    private userModel;
    private readonly ws;
    constructor(notificationModel: Model<Notification>, userModel: Model<User>, ws: WsGateway);
    create(userId: string | Types.ObjectId, type: string, data: any): Promise<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    createForUsers(userIds: Array<string | Types.ObjectId>, type: string, data: any): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, Omit<{
        userId: Types.ObjectId;
        type: string;
        data: any;
    }[], "_id">>[]>;
    createForAll(type: string, data: any): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, Omit<{
        userId: import("mongoose").FlattenMaps<unknown>;
        type: string;
        data: any;
    }[], "_id">>[]>;
    list(userId: string): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    unreadCount(userId: string): Promise<number>;
    markRead(id: string, userId?: string): Promise<import("mongoose").Document<unknown, {}, Notification, {}, {}> & Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    markAllRead(userId: string): Promise<{
        ok: boolean;
    }>;
    private serialize;
}
