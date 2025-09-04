import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop() name?: string;
  @Prop() color?: string;
  @Prop() size?: string;
  @Prop({ required: true }) quantity: number;
  @Prop({ required: true }) unitPrice: number;
  @Prop({ required: true }) unitPointsPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cart: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  // address snapshot
  @Prop({
    type: {
      addressLine1: String,
      city: String,
      province: String,
      country: String,
      postalCode: String,
    },
  })
  address: any;

  @Prop({ default: 15 }) // PKR
  deliveryFee: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ enum: ['money', 'points', 'hybrid'], default: 'money' })
  paymentMethod: string;

  @Prop({ default: 0 })
  pointsUsed: number;

  @Prop({ default: 0 })
  pointsEarned: number;

  // mark true when paid (you said hardcode on payment success)
  @Prop({ default: true })
  completed: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
