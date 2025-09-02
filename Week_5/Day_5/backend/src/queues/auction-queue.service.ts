// src/queues/auction-queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Auction } from '../schemas/auction.schema';
import { Model } from 'mongoose';
import { WsGateway } from '../ws/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service'; // 👈 add

@Injectable()
@Processor('auction')
export class AuctionProcessor extends WorkerHost {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    private ws: WsGateway,
    private notifications: NotificationsService, // 👈 add
  ) { super(); }

  async process(job: any) {
    if (job.name === 'end') {
      const auctionId = job.data.auctionId as string;
      const auc = await this.auctionModel.findById(auctionId);
      if (!auc) return;
      if (auc.status !== 'live') return;

      auc.status = 'ended';
      await auc.save();

      // 🔔 notifications
      await this.notifications.createForAll('auction_ended', { auctionId });
      if (auc.winnerId) {
        await this.notifications.create(auc.winnerId, 'auction_won', { auctionId, winnerId: auc.winnerId });

        // OPTIONAL broadcast winner to everyone:
        await this.notifications.createForAll('auction_won', { auctionId, winnerId: auc.winnerId });
        this.ws.emitGlobal('auction_won', { auctionId, winnerId: auc.winnerId });
      }

      this.ws.emitAuction(auctionId, 'auction_ended', { auctionId });
      if (auc.winnerId) {
        this.ws.emitAuction(auctionId, 'auction_won', { auctionId, winnerId: auc.winnerId });
      }
    }
  }
}

@Injectable()
export class AuctionQueueService {
  constructor(@InjectQueue('auction') private auctionQueue: Queue) {}

  async scheduleEnd(auctionId: string, endAt: Date) {
    const delay = Math.max(0, endAt.getTime() - Date.now());
    await this.auctionQueue.add('end', { auctionId }, { delay });
  }
}
