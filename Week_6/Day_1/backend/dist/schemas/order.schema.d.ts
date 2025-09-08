import { Document, Types } from 'mongoose';
export type OrderDocument = Order & Document;
export declare class OrderItem {
    product: Types.ObjectId;
    name?: string;
    color?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    unitPointsPrice: number;
}
export declare const OrderItemSchema: import("mongoose").Schema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, Document<unknown, any, OrderItem> & OrderItem & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, Document<unknown, {}, import("mongoose").FlatRecord<OrderItem>> & import("mongoose").FlatRecord<OrderItem> & {
    _id: Types.ObjectId;
}>;
export declare class Order {
    user: Types.ObjectId;
    cart: Types.ObjectId;
    items: OrderItem[];
    address: any;
    deliveryFee: number;
    discount: number;
    subtotal: number;
    total: number;
    paymentMethod: string;
    pointsUsed: number;
    pointsEarned: number;
    completed: boolean;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
}>;
