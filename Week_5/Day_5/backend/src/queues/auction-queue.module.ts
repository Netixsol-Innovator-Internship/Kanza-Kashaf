import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuctionQueueService, AuctionProcessor } from './auction-queue.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { WsModule } from '../ws/ws.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'auction' }),
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    WsModule,
    NotificationsModule,
  ],
  providers: [AuctionQueueService, AuctionProcessor],
  exports: [AuctionQueueService],
})
export class AuctionQueueModule {}
