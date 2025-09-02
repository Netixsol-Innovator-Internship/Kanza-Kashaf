// src/bids/bids.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bid } from '../schemas/bid.schema';
import { Auction } from '../schemas/auction.schema';
import { User } from '../schemas/user.schema';
import { PlaceBidDto } from './dto/place-bid.dto';
import { WsGateway } from '../ws/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(User.name) private userModel: Model<User>,
    private ws: WsGateway,
    private notifications: NotificationsService,
  ) {}

  async placeBid(userId: string, dto: PlaceBidDto) {
    if (!userId) throw new ForbiddenException('You must be logged in to place a bid');

    const auction = await this.auctionModel.findById(dto.auctionId);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.status !== 'live') throw new BadRequestException('Auction is not live');
    if (auction.sellerId.toString() === userId) throw new ForbiddenException('Cannot bid on your own auction');

    // Get last bid
    const lastBid = await this.bidModel.findOne({ auctionId: dto.auctionId }).sort({ createdAt: -1 });

    let minAllowed: number;
    if (lastBid) {
      minAllowed = lastBid.amount + auction.minIncrement;
    } else {
      minAllowed = auction.minBid;
    }

    if (dto.amount < minAllowed) {
      throw new BadRequestException(`Bid must be at least ${minAllowed}`);
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Bid amount must be greater than 0');
    }

    // ✅ User check
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Create new bid
    const bid = await this.bidModel.create({
      auctionId: new Types.ObjectId(dto.auctionId),
      bidderId: new Types.ObjectId(userId),
      amount: dto.amount,
    });

    // ✅ Link bid to user
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { myBids: auction._id } }, // keeps array unique
      { new: true }
    );

    // ✅ Update auction fields
    const updatedAuction = await this.auctionModel.findByIdAndUpdate(
      auction._id,
      {
        $set: {
          currentPrice: dto.amount,
          winnerId: new Types.ObjectId(userId),
          highest: {
            bidderName: user.fullName,
            bidderEmail: user.email,
            bidderPhone: user.phone,
            bidderNationality: user.nationality,
            bidderIdType: user.idType,
            bidderAvatar: user.avatar,
            bid: dto.amount,
          },
        },
        $inc: { totalBids: 1 },
        $addToSet: { biddersList: new Types.ObjectId(userId) },
      },
      { new: true }
    );

    // 🔔 Notify seller + bidders
    const audience = new Set<string>([
      updatedAuction.sellerId.toString(),
      ...updatedAuction.biddersList.map((x) => x.toString()),
    ]);

    await this.notifications.createForUsers(Array.from(audience), 'new_bid', {
      auctionId: updatedAuction._id,
      amount: dto.amount,
      bidderId: userId,
    });

    // 🔊 Realtime to auction room
    this.ws.emitAuction(updatedAuction._id.toString(), 'new_bid', {
      auctionId: updatedAuction._id.toString(),
      amount: dto.amount,
      userId,
    });

    return bid;
  }

  async getBidsForAuction(auctionId: string) {
    return this.bidModel.find({ auctionId: new Types.ObjectId(auctionId) }) // <-- Ensure ObjectId
      .sort({ createdAt: -1 })
      .populate('bidderId', 'fullName email')
      .select('amount bidderId createdAt')
      .exec();
  }
}
