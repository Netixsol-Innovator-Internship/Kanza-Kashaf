import { Document, Types } from 'mongoose';
export declare class User extends Document {
    username: string;
    email: string;
    password: string;
    emailVerified: boolean;
    fullName: string;
    phone: string;
    avatar: string;
    nationality?: string;
    idType?: string;
    idNumber?: string;
    myCars: Types.ObjectId[];
    myBids: Types.ObjectId[];
    wishlist: Types.ObjectId[];
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
