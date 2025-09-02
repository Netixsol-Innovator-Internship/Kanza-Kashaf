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
exports.AuctionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auction_schema_1 = require("../schemas/auction.schema");
const auction_queue_service_1 = require("../queues/auction-queue.service");
const user_schema_1 = require("../schemas/user.schema");
const ws_gateway_1 = require("../ws/ws.gateway");
const schedule_1 = require("@nestjs/schedule");
const notifications_service_1 = require("../notifications/notifications.service");
let AuctionsService = class AuctionsService {
    constructor(auctionModel, userModel, queue, ws, notifications) {
        this.auctionModel = auctionModel;
        this.userModel = userModel;
        this.queue = queue;
        this.ws = ws;
        this.notifications = notifications;
    }
    async findBySeller(userId) {
        return this.auctionModel
            .find({ sellerId: new mongoose_2.Types.ObjectId(userId) })
            .select('make carModel year minBid photos status winnerId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async create(userId, dto) {
        const start = new Date(dto.startTime);
        const end = new Date(dto.endTime);
        if (end <= start)
            throw new common_1.BadRequestException('endTime must be after startTime');
        const auction = await this.auctionModel.create(Object.assign(Object.assign({}, dto), { sellerId: new mongoose_2.Types.ObjectId(userId), startTime: start, endTime: end, status: 'live', currentPrice: dto.minBid }));
        await this.userModel.findByIdAndUpdate(userId, { $push: { myCars: auction._id } }, { new: true });
        await this.queue.scheduleEnd(auction._id.toString(), end);
        await this.notifications.createForAll('auction_started', {
            auctionId: auction._id,
        });
        this.ws.emitGlobal('auction_started', { auctionId: auction._id });
        return auction;
    }
    async list(query) {
        const { make, carModel, year } = query;
        const filters = { status: { $ne: 'ended' } };
        if (make)
            filters['make'] = make;
        if (carModel)
            filters['carModel'] = carModel;
        if (year)
            filters['year'] = year;
        return this.auctionModel.find(filters).sort({ createdAt: -1 });
    }
    async getAuctionDetails(auctionId) {
        const auction = await this.auctionModel.findById(auctionId).exec();
        if (!auction) {
            throw new common_1.NotFoundException('Auction not found');
        }
        return auction;
    }
    async get(id) {
        const auc = await this.auctionModel.findById(id);
        if (!auc)
            throw new common_1.NotFoundException('Auction not found');
        if (auc.status === 'live' && auc.endTime <= new Date()) {
            auc.status = 'ended';
            await auc.save();
            await this.notifications.createForAll('auction_ended', { auctionId: id });
            if (auc.winnerId) {
                await this.notifications.create(auc.winnerId, 'auction_won', { auctionId: id, winnerId: auc.winnerId });
            }
            this.ws.emitAuction(id, 'auction_ended', { auctionId: id });
            if (auc.winnerId) {
                this.ws.emitAuction(id, 'auction_won', { auctionId: id, winnerId: auc.winnerId });
            }
        }
        return auc;
    }
    async endAuction(auctionId, requesterId) {
        const auc = await this.auctionModel.findById(auctionId);
        if (!auc)
            throw new common_1.NotFoundException('Auction not found');
        if (auc.sellerId.toString() !== requesterId)
            throw new common_1.ForbiddenException('Only creator can end');
        if (auc.status !== 'live')
            throw new common_1.BadRequestException('Auction already ended');
        auc.status = 'ended';
        await auc.save();
        await this.notifications.createForAll('auction_ended', { auctionId });
        this.ws.emitGlobal('auction_ended', { auctionId });
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
                await this.notifications.create(auc.winnerId, 'auction_won', { auctionId: auc._id, winnerId: auc.winnerId });
            }
            this.ws.emitAuction(auc._id.toString(), 'auction_ended', { auctionId: auc._id });
            if (auc.winnerId) {
                this.ws.emitAuction(auc._id.toString(), 'auction_won', { auctionId: auc._id, winnerId: auc.winnerId });
            }
        }
    }
    async toggleWishlist(userId, auctionId) {
        const auction = await this.auctionModel.findById(auctionId);
        if (!auction)
            throw new common_1.NotFoundException('Auction not found');
        if (auction.sellerId.toString() === userId) {
            throw new common_1.BadRequestException('You cannot add your own auction to wishlist');
        }
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isInWishlist = user.wishlist.some((aId) => aId.toString() === auctionId);
        if (isInWishlist) {
            user.wishlist = user.wishlist.filter((aId) => aId.toString() !== auctionId);
        }
        else {
            user.wishlist.push(new mongoose_2.Types.ObjectId(auctionId));
        }
        await user.save();
        await this.notifications.create(userId, 'wishlist_updated', {
            auctionId,
            added: !isInWishlist,
        });
        this.ws.emitToUser(userId, 'wishlist_updated', {
            auctionId,
            added: !isInWishlist,
        });
        return { wishlist: user.wishlist, added: !isInWishlist };
    }
};
exports.AuctionsService = AuctionsService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuctionsService.prototype, "closeExpiredAuctions", null);
exports.AuctionsService = AuctionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(auction_schema_1.Auction.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        auction_queue_service_1.AuctionQueueService,
        ws_gateway_1.WsGateway,
        notifications_service_1.NotificationsService])
], AuctionsService);
//# sourceMappingURL=auctions.service.js.map