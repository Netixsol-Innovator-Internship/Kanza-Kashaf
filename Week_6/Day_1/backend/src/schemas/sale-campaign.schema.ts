import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './product.schema';

export type SaleCampaignDocument = SaleCampaign & Document;

@Schema({ timestamps: true })
export class SaleCampaign {
  @Prop({ required: true }) name: string;
  @Prop() description?: string;
  @Prop({ required: true }) percent: number; // e.g., 20
  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] }) productIds: Types.ObjectId[]; // specific products
  @Prop({ type: [String], enum: Category, default: [] }) categories: Category[]; // categories affected
  @Prop({ type: Date, required: true }) startAt: Date;
  @Prop({ type: Date, required: true }) endAt: Date;
  @Prop({ type: Boolean, default: false }) startNotified: boolean;
  @Prop({ type: Boolean, default: false }) endNotified: boolean;
}

export const SaleCampaignSchema = SchemaFactory.createForClass(SaleCampaign);
