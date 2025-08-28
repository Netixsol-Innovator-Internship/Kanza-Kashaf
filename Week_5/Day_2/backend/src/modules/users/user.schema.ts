import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string;

  // preserve the original-cased name the user typed
  @Prop({ required: true, trim: true })
  displayName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  profilePic: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ type: [String], default: [] })
  followers: string[]; // userIds

  @Prop({ type: [String], default: [] })
  following: string[]; // userIds
}

export const UserSchema = SchemaFactory.createForClass(User);
