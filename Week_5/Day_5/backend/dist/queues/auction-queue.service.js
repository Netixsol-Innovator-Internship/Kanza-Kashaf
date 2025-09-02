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
exports.AuctionQueueService = exports.AuctionProcessor = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const mongoose_1 = require("@nestjs/mongoose");
const auction_schema_1 = require("../schemas/auction.schema");
const mongoose_2 = require("mongoose");
const ws_gateway_1 = require("../ws/ws.gateway");
const notifications_service_1 = require("../notifications/notifications.service");
let AuctionProcessor = class AuctionProcessor extends bullmq_1.WorkerHost {
    constructor(auctionModel, ws, notifications) {
        super();
        this.auctionModel = auctionModel;
        this.ws = ws;
        this.notifications = notifications;
    }
    async process(job) {
        if (job.name === 'end') {
            const auctionId = job.data.auctionId;
            const auc = await this.auctionModel.findById(auctionId);
            if (!auc)
                return;
            if (auc.status !== 'live')
                return;
            auc.status = 'ended';
            await auc.save();
            await this.notifications.createForAll('auction_ended', { auctionId });
            if (auc.winnerId) {
                await this.notifications.create(auc.winnerId, 'auction_won', { auctionId, winnerId: auc.winnerId });
                await this.notifications.createForAll('auction_won', { auctionId, winnerId: auc.winnerId });
                this.ws.emitGlobal('auction_won', { auctionId, winnerId: auc.winnerId });
            }
            this.ws.emitAuction(auctionId, 'auction_ended', { auctionId });
            if (auc.winnerId) {
                this.ws.emitAuction(auctionId, 'auction_won', { auctionId, winnerId: auc.winnerId });
            }
        }
    }
};
exports.AuctionProcessor = AuctionProcessor;
exports.AuctionProcessor = AuctionProcessor = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)('auction'),
    __param(0, (0, mongoose_1.InjectModel)(auction_schema_1.Auction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ws_gateway_1.WsGateway,
        notifications_service_1.NotificationsService])
], AuctionProcessor);
let AuctionQueueService = class AuctionQueueService {
    constructor(auctionQueue) {
        this.auctionQueue = auctionQueue;
    }
    async scheduleEnd(auctionId, endAt) {
        const delay = Math.max(0, endAt.getTime() - Date.now());
        await this.auctionQueue.add('end', { auctionId }, { delay });
    }
};
exports.AuctionQueueService = AuctionQueueService;
exports.AuctionQueueService = AuctionQueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('auction')),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], AuctionQueueService);
//# sourceMappingURL=auction-queue.service.js.map