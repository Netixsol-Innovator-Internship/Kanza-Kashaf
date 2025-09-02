import { Model, Types } from 'mongoose';
import { Auction } from '../schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuctionQueueService } from '../queues/auction-queue.service';
import { User } from '../schemas/user.schema';
import { WsGateway } from '../ws/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AuctionsService {
    private auctionModel;
    private userModel;
    private queue;
    private ws;
    private notifications;
    constructor(auctionModel: Model<Auction>, userModel: Model<User>, queue: AuctionQueueService, ws: WsGateway, notifications: NotificationsService);
    findBySeller(userId: string): Promise<(import("mongoose").Document<unknown, {}, Auction, {}, {}> & Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    create(userId: string, dto: CreateAuctionDto): Promise<import("mongoose").Document<unknown, {}, Auction, {}, {}> & Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    list(query: any): Promise<(import("mongoose").Document<unknown, {}, Auction, {}, {}> & Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAuctionDetails(auctionId: string): Promise<import("mongoose").Document<unknown, {}, Auction, {}, {}> & Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    get(id: string): Promise<import("mongoose").Document<unknown, {}, Auction, {}, {}> & Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    endAuction(auctionId: string, requesterId: string): Promise<import("mongoose").Document<unknown, {}, Auction, {}, {}> & Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    closeExpiredAuctions(): Promise<void>;
    toggleWishlist(userId: string, auctionId: string): Promise<{
        wishlist: Types.ObjectId[];
        added: boolean;
    }>;
}
