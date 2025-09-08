import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  codeHash: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  attempts: number;

  // 👇 explicitly declare timestamps so TS knows about them
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
