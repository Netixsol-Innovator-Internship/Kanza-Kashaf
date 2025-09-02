import { Document, Types } from 'mongoose';
export type NotificationType = 'auction_started' | 'new_bid' | 'auction_won' | 'auction_ended' | 'wishlist_updated' | 'auction_created';
export declare class Notification extends Document {
    userId: Types.ObjectId;
    type: NotificationType;
    data: any;
    read: boolean;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification, any, {}> & Notification & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Notification> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
