import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
    checkout(req: any, cartId: string, body: {
        paymentMethod: string;
        pointsUsed?: number;
        hybridSelections?: {
            productId: string;
            method: 'money' | 'points';
        }[];
    }): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/order.schema").OrderDocument> & import("../../schemas/order.schema").Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getOrder(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/order.schema").OrderDocument> & import("../../schemas/order.schema").Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getOrderHistory(req: any): Promise<Omit<import("mongoose").Document<unknown, {}, import("../../schemas/order.schema").OrderDocument> & import("../../schemas/order.schema").Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>[]>;
    getAllOrders(page?: string, limit?: string): Promise<{
        orders: Omit<Omit<import("mongoose").Document<unknown, {}, import("../../schemas/order.schema").OrderDocument> & import("../../schemas/order.schema").Order & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>, never>[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    adminStats(): Promise<{
        totalOrders: number;
        activeOrders: number;
        completedOrders: number;
        returnedOrders: number;
    }>;
    adminSales(range?: string): Promise<{
        period: any;
        total: any;
    }[]>;
    adminBestSellers(limit?: string): Promise<any[]>;
    adminRecentOrders(limit?: string): Promise<Omit<Omit<import("mongoose").Document<unknown, {}, import("../../schemas/order.schema").OrderDocument> & import("../../schemas/order.schema").Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, never>[]>;
    getOrderAdmin(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/order.schema").OrderDocument> & import("../../schemas/order.schema").Order & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
