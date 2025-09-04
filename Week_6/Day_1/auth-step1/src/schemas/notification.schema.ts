import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from './user.schema';
import { ApiProperty } from '@nestjs/swagger';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @ApiProperty()
  @Prop({ required: true })
  type: string;

  @ApiProperty()
  @Prop({ required: true })
  message: string;

  @ApiProperty({ type: String, nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  user: Types.ObjectId | null;

  @ApiProperty({ enum: Role, default: Role.USER })
  @Prop({ enum: Role, default: Role.USER })
  targetRole: Role;

  @ApiProperty({ default: false })
  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
