"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bid_schema_1 = require("../schemas/bid.schema");
const auction_schema_1 = require("../schemas/auction.schema");
const user_schema_1 = require("../schemas/user.schema");
const ws_gateway_1 = require("../ws/ws.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
let BidsService = class BidsService {
    constructor(bidModel, auctionModel, userModel, ws, notifications) {
        this.bidModel = bidModel;
        this.auctionModel = auctionModel;
        this.userModel = userModel;
        this.ws = ws;
        this.notifications = notifications;
    }
    async placeBid(userId, dto) {
        if (!userId)
            throw new common_1.ForbiddenException('You must be logged in to place a bid');
        const auction = await this.auctionModel.findById(dto.auctionId);
        if (!auction)
            throw new common_1.NotFoundException('Auction not found');
        if (auction.status !== 'live')
            throw new common_1.BadRequestException('Auction is not live');
        if (auction.sellerId.toString() === userId)
            throw new common_1.ForbiddenException('Cannot bid on your own auction');
        const lastBid = await this.bidModel.findOne({ auctionId: dto.auctionId }).sort({ createdAt: -1 });
        let minAllowed;
        if (lastBid) {
            minAllowed = lastBid.amount + auction.minIncrement;
        }
        else {
            minAllowed = auction.minBid;
        }
        if (dto.amount < minAllowed) {
            throw new common_1.BadRequestException(`Bid must be at least ${minAllowed}`);
        }
        if (dto.amount <= 0) {
            throw new common_1.BadRequestException('Bid amount must be greater than 0');
        }
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const bid = await this.bidModel.create({
            auctionId: new mongoose_2.Types.ObjectId(dto.auctionId),
            bidderId: new mongoose_2.Types.ObjectId(userId),
            amount: dto.amount,
        });
        await this.userModel.findByIdAndUpdate(userId, { $addToSet: { myBids: auction._id } }, { new: true });
        const updatedAuction = await this.auctionModel.findByIdAndUpdate(auction._id, {
            $set: {
                currentPrice: dto.amount,
                winnerId: new mongoose_2.Types.ObjectId(userId),
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
            $addToSet: { biddersList: new mongoose_2.Types.ObjectId(userId) },
        }, { new: true });
        const audience = new Set([
            updatedAuction.sellerId.toString(),
            ...updatedAuction.biddersList.map((x) => x.toString()),
        ]);
        await this.notifications.createForUsers(Array.from(audience), 'new_bid', {
            auctionId: updatedAuction._id,
            amount: dto.amount,
            bidderId: userId,
        });
        this.ws.emitAuction(updatedAuction._id.toString(), 'new_bid', {
            auctionId: updatedAuction._id.toString(),
            amount: dto.amount,
            userId,
        });
        return bid;
    }
    async getBidsForAuction(auctionId) {
        return this.bidModel.find({ auctionId: new mongoose_2.Types.ObjectId(auctionId) })
            .sort({ createdAt: -1 })
            .populate('bidderId', 'fullName email')
            .select('amount bidderId createdAt')
            .exec();
    }
};
exports.BidsService = BidsService;
exports.BidsService = BidsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bid_schema_1.Bid.name)),
    __param(1, (0, mongoose_1.InjectModel)(auction_schema_1.Auction.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        ws_gateway_1.WsGateway,
        notifications_service_1.NotificationsService])
], BidsService);
//# sourceMappingURL=bids.service.js.map