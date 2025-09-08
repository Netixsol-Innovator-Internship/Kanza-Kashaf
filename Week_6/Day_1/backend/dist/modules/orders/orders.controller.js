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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
const user_schema_1 = require("../../schemas/user.schema");
const swagger_1 = require("@nestjs/swagger");
let OrdersController = class OrdersController {
    constructor(orders) {
        this.orders = orders;
    }
    async checkout(req, cartId, body) {
        return this.orders.checkout(req.user.userId, cartId, body.paymentMethod, body.pointsUsed || 0, body.hybridSelections || []);
    }
    async getOrder(req, id) {
        return this.orders.getOrder(req.user.userId, id);
    }
    async getOrderHistory(req) {
        return this.orders.getOrderHistory(req.user.userId);
    }
    async getAllOrders(page = '1', limit = '8') {
        return this.orders.getAllOrders(parseInt(page, 10), parseInt(limit, 10));
    }
    async adminStats() {
        return this.orders.getAdminStats();
    }
    async adminSales(range) {
        const r = (range === 'daily' || range === 'weekly') ? range : 'monthly';
        return this.orders.getSalesGraph(r);
    }
    async adminBestSellers(limit) {
        const l = limit ? parseInt(limit, 10) : 3;
        return this.orders.getBestSellers(l);
    }
    async adminRecentOrders(limit) {
        const l = limit ? parseInt(limit, 10) : 6;
        return this.orders.getRecentOrders(l);
    }
    async getOrderAdmin(id) {
        return this.orders.getOrderAdmin(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('checkout/:cartId'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                paymentMethod: {
                    type: 'string',
                    enum: ['Money', 'Points', 'Hybrid'],
                    example: 'Hybrid',
                    description: 'Choose "Money" for cash/card payments, "Points" for loyalty points, or "Hybrid" when cart contains mixed product payment types. For hybrid, include hybridSelections mapping.',
                },
                pointsUsed: {
                    type: 'number',
                    example: 100,
                    description: 'Only for Money payments with partial points. Ignored if paymentMethod = "Points".',
                },
                hybridSelections: {
                    type: 'array',
                    description: 'When paymentMethod=Hybrid, array of selections per hybrid product.',
                    items: {
                        type: 'object',
                        properties: {
                            productId: { type: 'string' },
                            method: { type: 'string', enum: ['money', 'points'] },
                        },
                    },
                },
            },
            required: ['paymentMethod'],
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Checkout the current cart and create an order',
        schema: {
            example: {
                _id: 'order001',
                user: 'user123',
                cart: 'cart123',
                subtotal: 2400,
                deliveryFee: 15,
                discount: 0,
                total: 2415,
                paymentMethod: 'Hybrid',
                pointsUsed: 120,
                pointsEarned: 12,
                completed: true,
                createdAt: '2025-09-04T12:00:00Z',
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('cartId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Returns a specific order belonging to the user',
        schema: {
            example: {
                _id: 'order001',
                user: 'user123',
                items: [
                    { product: { _id: 'prod123', name: 'T-Shirt' }, quantity: 2 },
                ],
                subtotal: 2400,
                total: 2415,
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)('history/me'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Returns order history of the logged-in user',
        schema: {
            example: [
                {
                    _id: 'order001',
                    subtotal: 2400,
                    total: 2415,
                    completed: true,
                    createdAt: '2025-08-30T11:00:00Z',
                },
            ],
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderHistory", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('admin/all'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Returns all orders in the system (admin only)',
        schema: {
            example: [
                {
                    _id: 'order001',
                    user: { _id: 'user123', name: 'John Doe', email: 'john@example.com' },
                    subtotal: 2400,
                    total: 2415,
                    completed: true,
                },
            ],
        },
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('admin/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "adminStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('admin/sales'),
    __param(0, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "adminSales", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('admin/best-sellers'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "adminBestSellers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('admin/recent'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "adminRecentOrders", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderAdmin", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map