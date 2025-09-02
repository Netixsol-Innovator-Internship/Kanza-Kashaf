// src/auctions/auctions.service.ts
import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction } from '../schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuctionQueueService } from '../queues/auction-queue.service';
import { User } from '../schemas/user.schema';
import { WsGateway } from '../ws/ws.gateway';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(User.name) private userModel: Model<User>,
    private queue: AuctionQueueService,
    private ws: WsGateway,
    private notifications: NotificationsService,
  ) {}

  async findBySeller(userId: string) {
    return this.auctionModel
      .find({ sellerId: new Types.ObjectId(userId) })
      .select('make carModel year minBid photos status winnerId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(userId: string, dto: CreateAuctionDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (end <= start) throw new BadRequestException('endTime must be after startTime');

    const auction = await this.auctionModel.create({
      ...dto,
      sellerId: new Types.ObjectId(userId),
      startTime: start,
      endTime: end,
      status: 'live',
      currentPrice: dto.minBid,
    });

    // ⬇️ Add auction reference into user's myCars
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { myCars: auction._id } },
      { new: true }
    );

    await this.queue.scheduleEnd(auction._id.toString(), end);

    // 🔔 notifications
    await this.notifications.createForAll('auction_started', {
      auctionId: auction._id,
    });

    // 🔊 realtime
    this.ws.emitGlobal('auction_started', { auctionId: auction._id });

    return auction;
  }

  async list(query: any) {
    const { make, carModel, year } = query;

    const filters: any = { status: { $ne: 'ended' } };

    if (make) filters['make'] = make;
    if (carModel) filters['carModel'] = carModel;
    if (year) filters['year'] = year;

    return this.auctionModel.find(filters).sort({ createdAt: -1 });
  }

  async getAuctionDetails(auctionId: string) {
    const auction = await this.auctionModel.findById(auctionId).exec();
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }
    return auction;
  }

  async get(id: string) {
    const auc = await this.auctionModel.findById(id);
    if (!auc) throw new NotFoundException('Auction not found');

    // ⏰ Auto-end if expired
    if (auc.status === 'live' && auc.endTime <= new Date()) {
      auc.status = 'ended';
      await auc.save();

      await this.notifications.createForAll('auction_ended', { auctionId: id });
      if (auc.winnerId) {
        await this.notifications.create(
          auc.winnerId,
          'auction_won',
          { auctionId: id, winnerId: auc.winnerId }
        );
      }

      this.ws.emitAuction(id, 'auction_ended', { auctionId: id });
      if (auc.winnerId) {
        this.ws.emitAuction(id, 'auction_won', { auctionId: id, winnerId: auc.winnerId });
      }
    }

    return auc;
  }

  async endAuction(auctionId: string, requesterId: string) {
    const auc = await this.auctionModel.findById(auctionId);
    if (!auc) throw new NotFoundException('Auction not found');
    if (auc.sellerId.toString() !== requesterId) throw new ForbiddenException('Only creator can end');
    if (auc.status !== 'live') throw new BadRequestException('Auction already ended');

    auc.status = 'ended';
    await auc.save();

    // 🔔 Announce to everyone: auction ended
    await this.notifications.createForAll('auction_ended', { auctionId });
    this.ws.emitGlobal('auction_ended', { auctionId });

    // 🔔 Announce to winner + all participants (if you want private notif too)
    if (auc.winnerId) {
      await this.notifications.createForAll('auction_won', {
        auctionId,
        winnerId: auc.winnerId,
      });
      this.ws.emitGlobal('auction_won', {
        auctionId,
        winnerId: auc.winnerId,
      });
    }
    return auc;
  }

  @Cron('0 * * * *') // runs every hour
  async closeExpiredAuctions() {
    const expired = await this.auctionModel.find({
      status: 'live',
      endTime: { $lte: new Date() }
    });

    for (const auc of expired) {
      auc.status = 'ended';
      await auc.save();

      await this.notifications.createForAll('auction_ended', { auctionId: auc._id });
      if (auc.winnerId) {
        await this.notifications.create(
          auc.winnerId,
          'auction_won',
          { auctionId: auc._id, winnerId: auc.winnerId }
        );
      }

      this.ws.emitAuction(auc._id.toString(), 'auction_ended', { auctionId: auc._id });
      if (auc.winnerId) {
        this.ws.emitAuction(auc._id.toString(), 'auction_won', { auctionId: auc._id, winnerId: auc.winnerId });
      }
    }
  }

  async toggleWishlist(userId: string, auctionId: string) {
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');

    if (auction.sellerId.toString() === userId) {
      throw new BadRequestException('You cannot add your own auction to wishlist');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isInWishlist = user.wishlist.some((aId) => aId.toString() === auctionId);

    if (isInWishlist) {
      user.wishlist = user.wishlist.filter((aId) => aId.toString() !== auctionId);
    } else {
      user.wishlist.push(new Types.ObjectId(auctionId));
    }

    await user.save();

    // 🔔 notify only that user
    await this.notifications.create(userId, 'wishlist_updated', {
      auctionId,
      added: !isInWishlist,
    });

    // 🔊 realtime to that user (so UI can update instantly)
    this.ws.emitToUser(userId, 'wishlist_updated', {
      auctionId,
      added: !isInWishlist,
    });

    return { wishlist: user.wishlist, added: !isInWishlist };
  }

}
