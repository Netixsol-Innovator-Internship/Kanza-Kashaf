"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const auctions_module_1 = require("./auctions/auctions.module");
const bids_module_1 = require("./bids/bids.module");
const notifications_module_1 = require("./notifications/notifications.module");
const mailer_module_1 = require("./mailer/mailer.module");
const bullmq_1 = require("@nestjs/bullmq");
const queue_module_1 = require("./queue/queue.module");
const auction_queue_module_1 = require("./queues/auction-queue.module");
const ws_module_1 = require("./ws/ws.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI),
            queue_module_1.QueueModule,
            bullmq_1.BullModule.forRoot({
                connection: {
                    url: process.env.REDIS_URL
                }
            }),
            auction_queue_module_1.AuctionQueueModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            auctions_module_1.AuctionsModule,
            bids_module_1.BidsModule,
            notifications_module_1.NotificationsModule,
            mailer_module_1.MailerModule,
            ws_module_1.WsModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map