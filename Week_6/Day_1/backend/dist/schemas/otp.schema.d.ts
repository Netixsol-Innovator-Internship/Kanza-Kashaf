import { Document, Types } from 'mongoose';
export type OtpDocument = Otp & Document;
export declare class Otp {
    user: Types.ObjectId;
    codeHash: string;
    type: string;
    expiresAt: Date;
    attempts: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, Document<unknown, any, Otp> & Otp & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, Document<unknown, {}, import("mongoose").FlatRecord<Otp>> & import("mongoose").FlatRecord<Otp> & {
    _id: Types.ObjectId;
}>;
