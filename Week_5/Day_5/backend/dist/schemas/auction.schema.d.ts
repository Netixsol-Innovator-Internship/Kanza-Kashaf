import { Document, Types } from 'mongoose';
export declare class Auction extends Document {
    vin: string;
    year: number;
    make: string;
    carModel: string;
    mileage: number;
    engineSize: string;
    paint: string;
    hasGccSpecs: string;
    features?: string;
    accidentHistory: string;
    serviceHistory: string;
    modificationStatus: string;
    minBid: number;
    photos: string[];
    sellerId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: string;
    minIncrement: number;
    currentPrice: number;
    winnerId: Types.ObjectId | null;
    highest: {
        bidderName: string;
        bidderEmail?: string;
        bidderPhone?: string;
        bidderNationality?: string;
        bidderIdType?: string;
        bidderAvatar?: string;
        bid: number;
    } | null;
    biddersList: Types.ObjectId[];
    totalBids: number;
}
export declare const AuctionSchema: import("mongoose").Schema<Auction, import("mongoose").Model<Auction, any, any, any, Document<unknown, any, Auction, any, {}> & Auction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Auction, Document<unknown, {}, import("mongoose").FlatRecord<Auction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Auction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
