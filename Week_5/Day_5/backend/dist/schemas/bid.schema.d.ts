import { Document, Types } from 'mongoose';
export declare class Bid extends Document {
    auctionId: Types.ObjectId;
    bidderId: Types.ObjectId;
    amount: number;
}
export declare const BidSchema: import("mongoose").Schema<Bid, import("mongoose").Model<Bid, any, any, any, Document<unknown, any, Bid, any, {}> & Bid & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bid, Document<unknown, {}, import("mongoose").FlatRecord<Bid>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Bid> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
