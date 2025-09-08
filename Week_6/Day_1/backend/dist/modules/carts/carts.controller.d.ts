import { CartsService } from './carts.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartsController {
    private readonly carts;
    constructor(carts: CartsService);
    addProduct(req: any, productId: string, body: AddCartItemDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/cart.schema").CartDocument> & import("../../schemas/cart.schema").Cart & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateProduct(req: any, productId: string, body: UpdateCartItemDto & {
        color?: string;
        size?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/cart.schema").CartDocument> & import("../../schemas/cart.schema").Cart & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    removeProduct(req: any, productId: string, body: {
        color?: string;
        size?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/cart.schema").CartDocument> & import("../../schemas/cart.schema").Cart & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getCurrentCart(req: any): Promise<import("mongoose").FlattenMaps<import("../../schemas/cart.schema").CartDocument> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getCartHistory(req: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../../schemas/cart.schema").CartDocument> & import("../../schemas/cart.schema").Cart & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>[]>;
}
