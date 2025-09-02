import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from '../schemas/auction.schema';
import { AuctionQueueModule } from '../queues/auction-queue.module';
import { User, UserSchema } from '../schemas/user.schema';
import { WsModule } from '../ws/ws.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuctionQueueModule,
    WsModule,
    NotificationsModule,
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService]
})
export class AuctionsModule {}
