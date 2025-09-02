"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidsModule = void 0;
const common_1 = require("@nestjs/common");
const bids_service_1 = require("./bids.service");
const bids_controller_1 = require("./bids.controller");
const mongoose_1 = require("@nestjs/mongoose");
const bid_schema_1 = require("../schemas/bid.schema");
const auction_schema_1 = require("../schemas/auction.schema");
const user_schema_1 = require("../schemas/user.schema");
const ws_module_1 = require("../ws/ws.module");
const notifications_module_1 = require("../notifications/notifications.module");
let BidsModule = class BidsModule {
};
exports.BidsModule = BidsModule;
exports.BidsModule = BidsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: bid_schema_1.Bid.name, schema: bid_schema_1.BidSchema },
                { name: auction_schema_1.Auction.name, schema: auction_schema_1.AuctionSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema }
            ]),
            ws_module_1.WsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [bids_controller_1.BidsController],
        providers: [bids_service_1.BidsService],
        exports: [bids_service_1.BidsService]
    })
], BidsModule);
//# sourceMappingURL=bids.module.js.map