// src/schemas/auction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Auction extends Document {
  // ---- Car fields ----
  @Prop({ required: true, unique: true })
  vin: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  carModel: string;

  @Prop({ required: true })
  mileage: number;

  @Prop({ required: true, enum: ['4 Cylinder','6 Cylinder','8 Cylinder','10 Cylinder','12 Cylinder'] })
  engineSize: string;

  @Prop({ required: true, enum: ['Original paint','Partially Repainted','Totally Repainted'] })
  paint: string;

  @Prop({ required: true, enum: ['Yes','No'] })
  hasGccSpecs: string;

  @Prop()
  features?: string;

  @Prop({ required: true, enum: ['Yes','No'] })
  accidentHistory: string;

  @Prop({ required: true, enum: ['Yes','No'] })
  serviceHistory: string;

  @Prop({ required: true, enum: ['Completely stock','Modified'] })
  modificationStatus: string;

  @Prop({ required: true })
  minBid: number;

  @Prop({
    type: [String],
    validate: [(val: string[]) => val.length === 6, 'Exactly 6 images required'],
  })
  photos: string[];

  // ---- Auction fields ----
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: 'live', enum: ['live','ended','paid'] })
  status: string;

  @Prop({ required: true, default: 100 })
  minIncrement: number;

  @Prop({ default: 0 })
  currentPrice: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winnerId: Types.ObjectId | null;

  @Prop({
    type: {
      bidderName: String,
      bidderEmail: String,
      bidderPhone: String,
      bidderNationality: String,
      bidderIdType: String,
      bidderAvatar: String,
      bid: Number,
    },
    default: null,
  })
  highest: {
    bidderName: string;
    bidderEmail?: string;
    bidderPhone?: string;
    bidderNationality?: string;
    bidderIdType?: string;
    bidderAvatar?: string;
    bid: number;
  } | null;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  biddersList: Types.ObjectId[];

  @Prop({ default: 0 })
  totalBids: number;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
