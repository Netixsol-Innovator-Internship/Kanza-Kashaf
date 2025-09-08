import { Document, Types } from 'mongoose';
import { Role } from './user.schema';
export type NotificationDocument = Notification & Document;
export declare class Notification {
    type: string;
    message: string;
    user: Types.ObjectId | null;
    targetRole: Role;
    read: boolean;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification> & Notification & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>> & import("mongoose").FlatRecord<Notification> & {
    _id: Types.ObjectId;
}>;
