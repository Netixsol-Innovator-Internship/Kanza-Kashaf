"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionQueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const auction_queue_service_1 = require("./auction-queue.service");
const mongoose_1 = require("@nestjs/mongoose");
const auction_schema_1 = require("../schemas/auction.schema");
const ws_module_1 = require("../ws/ws.module");
const notifications_module_1 = require("../notifications/notifications.module");
let AuctionQueueModule = class AuctionQueueModule {
};
exports.AuctionQueueModule = AuctionQueueModule;
exports.AuctionQueueModule = AuctionQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({ name: 'auction' }),
            mongoose_1.MongooseModule.forFeature([{ name: auction_schema_1.Auction.name, schema: auction_schema_1.AuctionSchema }]),
            ws_module_1.WsModule,
            notifications_module_1.NotificationsModule,
        ],
        providers: [auction_queue_service_1.AuctionQueueService, auction_queue_service_1.AuctionProcessor],
        exports: [auction_queue_service_1.AuctionQueueService],
    })
], AuctionQueueModule);
//# sourceMappingURL=auction-queue.module.js.map