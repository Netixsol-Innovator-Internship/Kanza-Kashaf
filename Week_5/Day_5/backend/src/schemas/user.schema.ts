import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  fullName: string;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop()
  nationality?: string;

  @Prop()
  idType?: string;

  @Prop()
  idNumber?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Car' }], default: [] })
  myCars: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Auction' }], default: [] })
  myBids: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Auction' }], default: [] })
  wishlist: Types.ObjectId[];
}
export const UserSchema = SchemaFactory.createForClass(User);
