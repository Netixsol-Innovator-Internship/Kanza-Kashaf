import { Document, Types } from 'mongoose';
export type CartDocument = Cart & Document;
export declare class CartItem {
    product: Types.ObjectId;
    color?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    unitPointsPrice: number;
}
export declare class Cart {
    user: Types.ObjectId;
    items: CartItem[];
    checkedOut: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart> & Cart & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>> & import("mongoose").FlatRecord<Cart> & {
    _id: Types.ObjectId;
}>;
