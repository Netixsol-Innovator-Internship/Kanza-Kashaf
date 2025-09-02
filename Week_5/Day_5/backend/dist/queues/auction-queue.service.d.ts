import { WorkerHost } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Auction } from '../schemas/auction.schema';
import { Model } from 'mongoose';
import { WsGateway } from '../ws/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';
export declare class AuctionProcessor extends WorkerHost {
    private auctionModel;
    private ws;
    private notifications;
    constructor(auctionModel: Model<Auction>, ws: WsGateway, notifications: NotificationsService);
    process(job: any): Promise<void>;
}
export declare class AuctionQueueService {
    private auctionQueue;
    constructor(auctionQueue: Queue);
    scheduleEnd(auctionId: string, endAt: Date): Promise<void>;
}
