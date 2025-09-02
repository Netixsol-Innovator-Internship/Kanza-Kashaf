  import { Module } from '@nestjs/common';
  import { BidsService } from './bids.service';
  import { BidsController } from './bids.controller';
  import { MongooseModule } from '@nestjs/mongoose';
  import { Bid, BidSchema } from '../schemas/bid.schema';
  import { Auction, AuctionSchema } from '../schemas/auction.schema';
  import { User, UserSchema } from '../schemas/user.schema';
  import { WsModule } from '../ws/ws.module';
  import { NotificationsModule } from '../notifications/notifications.module';

  @Module({
    imports: [
      MongooseModule.forFeature([
        { name: Bid.name, schema: BidSchema },
        { name: Auction.name, schema: AuctionSchema },
        { name: User.name, schema: UserSchema }
      ]),
      WsModule,
      NotificationsModule,
    ],
    controllers: [BidsController],
    providers: [BidsService],
    exports: [BidsService]
  })
  export class BidsModule {}
