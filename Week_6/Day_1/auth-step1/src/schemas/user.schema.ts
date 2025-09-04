import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true, lowercase: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ default: 0 }) loyaltyPoints: number;
  @Prop({ default: Role.USER, enum: Role }) role: Role;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Cart' }], default: [] }) cart: Types.ObjectId[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Order' }], default: [] }) orders: Types.ObjectId[];
  @Prop({ default: false }) isEmailVerified: boolean;
  @Prop({ default: false }) blocked: boolean;
  @Prop({
    type: [
      {
        addressLine1: String,
        city: String,
        province: String,
        country: String,
        postalCode: String,
      },
    ],
    default: [],
  })
  addresses: any[];
  @Prop({ default: null }) refreshTokenHash: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User & Document>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};
