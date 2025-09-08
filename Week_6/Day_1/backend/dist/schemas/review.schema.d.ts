import { Document, Types } from 'mongoose';
export type ReviewDocument = Review & Document;
export declare class Review {
    user: Types.ObjectId;
    product: Types.ObjectId;
    rating: number;
    comment: string;
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review> & Review & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>> & import("mongoose").FlatRecord<Review> & {
    _id: Types.ObjectId;
}>;
