import { Document, Types } from 'mongoose';
import { Category } from './product.schema';
export type SaleCampaignDocument = SaleCampaign & Document;
export declare class SaleCampaign {
    name: string;
    description?: string;
    percent: number;
    productIds: Types.ObjectId[];
    categories: Category[];
    startAt: Date;
    endAt: Date;
}
export declare const SaleCampaignSchema: import("mongoose").Schema<SaleCampaign, import("mongoose").Model<SaleCampaign, any, any, any, Document<unknown, any, SaleCampaign> & SaleCampaign & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SaleCampaign, Document<unknown, {}, import("mongoose").FlatRecord<SaleCampaign>> & import("mongoose").FlatRecord<SaleCampaign> & {
    _id: Types.ObjectId;
}>;
