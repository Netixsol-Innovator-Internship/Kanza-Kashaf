"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const order_schema_1 = require("../../schemas/order.schema");
const cart_schema_1 = require("../../schemas/cart.schema");
const product_schema_1 = require("../../schemas/product.schema");
const sale_campaign_schema_1 = require("../../schemas/sale-campaign.schema");
const user_schema_1 = require("../../schemas/user.schema");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const notifications_module_1 = require("../notifications/notifications.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
                { name: cart_schema_1.Cart.name, schema: cart_schema_1.CartSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: sale_campaign_schema_1.SaleCampaign.name, schema: sale_campaign_schema_1.SaleCampaignSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            notifications_module_1.NotificationsModule,
        ],
        providers: [orders_service_1.OrdersService],
        controllers: [orders_controller_1.OrdersController],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map