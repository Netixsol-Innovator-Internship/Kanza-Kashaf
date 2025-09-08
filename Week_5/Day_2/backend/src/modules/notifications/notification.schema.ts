import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationType = 'comment' | 'reply' | 'like' | 'follow' | 'unfollow' | 'edit' | 'delete';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true }) userId: string; // recipient
  @Prop({ required: true }) type: NotificationType;
  @Prop({ required: true }) actorId: string;
  @Prop({ default: '' }) message: string;
  @Prop() commentId?: string;
  @Prop() targetUserId?: string;
  @Prop({ default: false }) read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);