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

// Backfill notifications' targetRole when user's role changes via save()
UserSchema.post<User & Document>('save', async function (doc) {
  try {
    if (this.isModified && this.isModified('role')) {
      await (this as any).model('Notification').updateMany(
        { user: doc._id },
        { $set: { targetRole: (doc as any).role } },
      );
    }
  } catch (e) {
    // non-blocking
  }
});

// Handle role changes done via findOneAndUpdate()
UserSchema.post('findOneAndUpdate', async function (doc: any) {
  try {
    if (!doc) return;
    const update: any = (this as any).getUpdate?.() || {};
    const newRole = update.role || update.$set?.role;
    if (!newRole) return;
    await (this as any).model('Notification').updateMany(
      { user: doc._id },
      { $set: { targetRole: newRole } },
    );
  } catch (e) {
    // non-blocking
  }
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};
