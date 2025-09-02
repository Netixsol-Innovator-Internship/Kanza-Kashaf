import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailerModule } from './mailer/mailer.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from './queue/queue.module';
import { AuctionQueueModule } from './queues/auction-queue.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    QueueModule,
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL
      }
    }),
    AuctionQueueModule,
    AuthModule,
    UsersModule,
    AuctionsModule,
    BidsModule,
    NotificationsModule,
    MailerModule,
    WsModule
  ]
})
export class AppModule {}
