import { Model } from 'mongoose';
import { Bid } from '../schemas/bid.schema';
import { Auction } from '../schemas/auction.schema';
import { User } from '../schemas/user.schema';
import { PlaceBidDto } from './dto/place-bid.dto';
import { WsGateway } from '../ws/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class BidsService {
    private bidModel;
    private auctionModel;
    private userModel;
    private ws;
    private notifications;
    constructor(bidModel: Model<Bid>, auctionModel: Model<Auction>, userModel: Model<User>, ws: WsGateway, notifications: NotificationsService);
    placeBid(userId: string, dto: PlaceBidDto): Promise<import("mongoose").Document<unknown, {}, Bid, {}, {}> & Bid & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getBidsForAuction(auctionId: string): Promise<(import("mongoose").Document<unknown, {}, Bid, {}, {}> & Bid & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
