import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare enum Role {
    USER = "user",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User {
    name: string;
    email: string;
    password: string;
    loyaltyPoints: number;
    role: Role;
    cart: Types.ObjectId[];
    orders: Types.ObjectId[];
    isEmailVerified: boolean;
    blocked: boolean;
    addresses: any[];
    refreshTokenHash: string | null;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
