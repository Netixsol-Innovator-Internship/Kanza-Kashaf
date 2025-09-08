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
exports.CartsController = void 0;
const common_1 = require("@nestjs/common");
const carts_service_1 = require("./carts.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const add_cart_item_dto_1 = require("./dto/add-cart-item.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
let CartsController = class CartsController {
    constructor(carts) {
        this.carts = carts;
    }
    async addProduct(req, productId, body) {
        return this.carts.addProduct(req.user.userId, productId, body.quantity, body.color, body.size);
    }
    async updateProduct(req, productId, body) {
        return this.carts.updateProduct(req.user.userId, productId, body.quantity, body.color, body.size);
    }
    async removeProduct(req, productId, body) {
        return this.carts.removeProduct(req.user.userId, productId, body.color, body.size);
    }
    async getCurrentCart(req) {
        return this.carts.getCurrentCart(req.user.userId);
    }
    async getCartHistory(req) {
        return this.carts.getCartHistory(req.user.userId);
    }
};
exports.CartsController = CartsController;
__decorate([
    (0, common_1.Post)('add/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to current cart' }),
    (0, swagger_1.ApiBody)({
        type: add_cart_item_dto_1.AddCartItemDto,
        examples: {
            default: {
                summary: 'Add Black T-Shirt (M) x2',
                value: {
                    productId: '64efc9f2d2a7b9c123456789',
                    color: 'black',
                    size: 'medium',
                    quantity: 2,
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: {
                userId: '64efc8f2d2a7b9c987654321',
                items: [
                    {
                        productId: '64efc9f2d2a7b9c123456789',
                        name: 'Classic Black T-Shirt',
                        color: 'black',
                        size: 'medium',
                        quantity: 2,
                        unitPrice: 2499,
                        totalPrice: 4998,
                    },
                ],
                totalItems: 2,
                totalPrice: 4998,
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_cart_item_dto_1.AddCartItemDto]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Patch)('update/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product quantity in cart' }),
    (0, swagger_1.ApiBody)({
        type: update_cart_item_dto_1.UpdateCartItemDto,
        examples: {
            default: {
                summary: 'Update quantity to 3',
                value: {
                    quantity: 3,
                    color: 'black',
                    size: 'medium',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: {
                userId: '64efc8f2d2a7b9c987654321',
                items: [
                    {
                        productId: '64efc9f2d2a7b9c123456789',
                        name: 'Classic Black T-Shirt',
                        color: 'black',
                        size: 'medium',
                        quantity: 3,
                        unitPrice: 2499,
                        totalPrice: 7497,
                    },
                ],
                totalItems: 3,
                totalPrice: 7497,
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('remove/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from cart' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: { color: 'black', size: 'medium' },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: {
                ok: true,
                message: 'Product removed from cart',
                remainingItems: [],
                totalPrice: 0,
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "removeProduct", null);
__decorate([
    (0, common_1.Get)('current'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current active cart' }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: {
                userId: '64efc8f2d2a7b9c987654321',
                items: [
                    {
                        productId: '64efc9f2d2a7b9c123456789',
                        name: 'Classic Black T-Shirt',
                        color: 'black',
                        size: 'medium',
                        quantity: 2,
                        unitPrice: 2499,
                        totalPrice: 4998,
                    },
                ],
                totalItems: 2,
                totalPrice: 4998,
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "getCurrentCart", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get past carts (orders history)' }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: [
                {
                    cartId: '64f0a1b2c3d4e5f678901234',
                    createdAt: '2025-08-01T10:15:30.000Z',
                    items: [
                        {
                            productId: '64efc9f2d2a7b9c123456789',
                            name: 'Classic Black T-Shirt',
                            color: 'black',
                            size: 'medium',
                            quantity: 2,
                            unitPrice: 2499,
                            totalPrice: 4998,
                        },
                        {
                            productId: '64efc9f2d2a7b9c223456789',
                            name: 'Denim Jeans',
                            color: 'blue',
                            size: 'large',
                            quantity: 1,
                            unitPrice: 3999,
                            totalPrice: 3999,
                        },
                    ],
                    totalItems: 3,
                    totalPrice: 8997,
                },
            ],
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartsController.prototype, "getCartHistory", null);
exports.CartsController = CartsController = __decorate([
    (0, swagger_1.ApiTags)('carts'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('carts'),
    __metadata("design:paramtypes", [carts_service_1.CartsService])
], CartsController);
//# sourceMappingURL=carts.controller.js.map