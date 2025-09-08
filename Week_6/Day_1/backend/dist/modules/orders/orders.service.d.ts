import { Model, Connection } from 'mongoose';
import { CartDocument } from '../../schemas/cart.schema';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { UserDocument } from '../../schemas/user.schema';
import { ProductDocument } from '../../schemas/product.schema';
import { SaleCampaignDocument } from '../../schemas/sale-campaign.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class OrdersService {
    private cartModel;
    private orderModel;
    private userModel;
    private productModel;
    private campaignModel;
    private readonly connection;
    private notifications;
    constructor(cartModel: Model<CartDocument>, orderModel: Model<OrderDocument>, userModel: Model<UserDocument>, productModel: Model<ProductDocument>, campaignModel: Model<SaleCampaignDocument>, connection: Connection, notifications: NotificationsService);
    private computePointsPrice;
    private computeEffectiveSalePercent;
    checkout(userId: string, cartId: string, paymentMethod: string, pointsUsed: number, hybridSelections?: {
        productId: string;
        method: 'money' | 'points';
    }[]): Promise<import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getOrder(userId: string, orderId: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getOrderHistory(userId: string): Promise<Omit<import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>[]>;
    getAdminStats(): Promise<{
        totalOrders: number;
        activeOrders: number;
        completedOrders: number;
        returnedOrders: number;
    }>;
    getSalesGraph(range?: 'daily' | 'weekly' | 'monthly'): Promise<{
        period: any;
        total: any;
    }[]>;
    getBestSellers(limit?: number): Promise<any[]>;
    getRecentOrders(limit?: number): Promise<Omit<Omit<import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, never>[]>;
    getAllOrders(page?: number, limit?: number): Promise<{
        orders: Omit<Omit<import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>, never>[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getOrderAdmin(orderId: string): Promise<import("mongoose").Document<unknown, {}, OrderDocument> & Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
