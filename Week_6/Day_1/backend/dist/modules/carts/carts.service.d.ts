import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from '../../schemas/cart.schema';
import { UserDocument } from '../../schemas/user.schema';
import { ProductDocument } from '../../schemas/product.schema';
import { SaleCampaignDocument } from '../../schemas/sale-campaign.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CartsService {
    private cartModel;
    private userModel;
    private productModel;
    private campaignModel;
    private notifications;
    constructor(cartModel: Model<CartDocument>, userModel: Model<UserDocument>, productModel: Model<ProductDocument>, campaignModel: Model<SaleCampaignDocument>, notifications: NotificationsService);
    private computePointsPrice;
    private computeSalePrice;
    private computeEffectiveSalePercent;
    private getOrCreateCurrentCart;
    addProduct(userId: string, productId: string, quantity: number, color?: string, size?: string): Promise<import("mongoose").Document<unknown, {}, CartDocument> & Cart & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    updateProduct(userId: string, productId: string, quantity: number, color?: string, size?: string): Promise<import("mongoose").Document<unknown, {}, CartDocument> & Cart & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    removeProduct(userId: string, productId: string, color?: string, size?: string): Promise<import("mongoose").Document<unknown, {}, CartDocument> & Cart & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    getCurrentCart(userId: string): Promise<import("mongoose").FlattenMaps<CartDocument> & {
        _id: Types.ObjectId;
    }>;
    getCartHistory(userId: string): Promise<Omit<import("mongoose").Document<unknown, {}, CartDocument> & Cart & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }, never>[]>;
}
