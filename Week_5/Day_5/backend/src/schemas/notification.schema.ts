import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationType =
  | 'auction_started'
  | 'new_bid'
  | 'auction_won'
  | 'auction_ended'
  | 'wishlist_updated'       // ✅ add
  | 'auction_created';       // ✅ optional (you said you want to notify everyone)

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: [
      'auction_started',
      'new_bid',
      'auction_won',
      'auction_ended',
      'wishlist_updated',     // ✅ add
      'auction_created',      // ✅ optional
    ],
  })
  type: NotificationType;

  @Prop({ type: Object })
  data: any;

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
