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
exports.CartsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("../../schemas/cart.schema");
const user_schema_1 = require("../../schemas/user.schema");
const product_schema_1 = require("../../schemas/product.schema");
const sale_campaign_schema_1 = require("../../schemas/sale-campaign.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let CartsService = class CartsService {
    constructor(cartModel, userModel, productModel, campaignModel, notifications) {
        this.cartModel = cartModel;
        this.userModel = userModel;
        this.productModel = productModel;
        this.campaignModel = campaignModel;
        this.notifications = notifications;
    }
    computePointsPrice(regularPrice) {
        return Math.round(regularPrice / 100);
    }
    computeSalePrice(price, percent) {
        if (!percent || percent <= 0)
            return price;
        return Math.round(price * (1 - percent / 100));
    }
    async computeEffectiveSalePercent(product) {
        const now = new Date();
        let maxPercent = 0;
        if (product.salePercent &&
            product.salePercent > 0 &&
            product.saleStartAt &&
            product.saleEndAt) {
            if (new Date(product.saleStartAt) <= now &&
                new Date(product.saleEndAt) >= now) {
                maxPercent = Math.max(maxPercent, product.salePercent);
            }
        }
        const campaigns = await this.campaignModel
            .find({
            startAt: { $lte: now },
            endAt: { $gte: now },
            $or: [{ productIds: product._id }, { categories: product.category }],
        })
            .lean();
        for (const c of campaigns) {
            if (c.percent && c.percent > maxPercent)
                maxPercent = c.percent;
        }
        return maxPercent;
    }
    async getOrCreateCurrentCart(userId) {
        const user = await this.userModel.findById(userId).populate('cart');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let cart = await this.cartModel.findOne({ user: userId, checkedOut: false });
        if (!cart) {
            cart = await this.cartModel.create({ user: userId, items: [] });
            user.cart.push(cart._id);
            await user.save();
        }
        return cart;
    }
    async addProduct(userId, productId, quantity, color, size) {
        const cart = await this.getOrCreateCurrentCart(userId);
        const product = await this.productModel.findById(productId);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const variant = (product.variants || []).find((v) => !color || v.color === color);
        if (variant) {
            if (size) {
                const sizeObj = variant.sizes.find((s) => s.size === size);
                if (!sizeObj || sizeObj.stock <= 0 || quantity > sizeObj.stock) {
                    await this.notifications.sendOutOfStockNotification(userId, product.name);
                    throw new common_1.BadRequestException('Requested size out of stock');
                }
            }
            else {
                const totalStock = (variant.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0);
                if (totalStock <= 0) {
                    await this.notifications.sendOutOfStockNotification(userId, product.name);
                    throw new common_1.BadRequestException('Variant out of stock');
                }
            }
        }
        else if (!variant && (color || size)) {
            await this.notifications.sendOutOfStockNotification(userId, product.name);
            throw new common_1.BadRequestException('Variant not found');
        }
        const existing = cart.items.find((i) => i.product.toString() === productId &&
            i.color === color &&
            i.size === size);
        if (existing) {
            existing.quantity += quantity;
        }
        else {
            cart.items.push({
                product: new mongoose_2.Types.ObjectId(productId),
                color,
                size,
                quantity,
                unitPrice: 0,
                unitPointsPrice: 0,
            });
        }
        await cart.save();
        return cart;
    }
    async updateProduct(userId, productId, quantity, color, size) {
        const cart = await this.getOrCreateCurrentCart(userId);
        const item = cart.items.find((i) => i.product.toString() === productId &&
            i.color === color &&
            i.size === size);
        if (!item)
            throw new common_1.NotFoundException('Product not in cart');
        if (quantity <= 0) {
            cart.items = cart.items.filter((i) => !(i.product.toString() === productId &&
                i.color === color &&
                i.size === size));
        }
        else {
            const product = await this.productModel.findById(productId);
            if (!product)
                throw new common_1.NotFoundException('Product not found');
            const variant = (product.variants || []).find((v) => !color || v.color === color);
            if (variant) {
                if (size) {
                    const sizeObj = variant.sizes.find((s) => s.size === size);
                    if (!sizeObj || sizeObj.stock < quantity) {
                        await this.notifications.sendOutOfStockNotification(userId, product.name);
                        throw new common_1.BadRequestException('Not enough stock');
                    }
                }
            }
            item.quantity = quantity;
        }
        await cart.save();
        return cart;
    }
    async removeProduct(userId, productId, color, size) {
        const cart = await this.getOrCreateCurrentCart(userId);
        cart.items = cart.items.filter((i) => !(i.product.toString() === productId &&
            i.color === color &&
            i.size === size));
        await cart.save();
        return cart;
    }
    async getCurrentCart(userId) {
        const cart = await this.cartModel
            .findOne({ user: userId, checkedOut: false })
            .populate('items.product')
            .lean();
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        for (const item of cart.items) {
            const p = item.product;
            if (!p || !p._id)
                continue;
            const salePercent = await this.computeEffectiveSalePercent(p);
            const salePrice = this.computeSalePrice(p.regularPrice, salePercent);
            let pointsPrice = 0;
            if (p.paymentType === product_schema_1.PaymentType.POINTS || p.paymentType === product_schema_1.PaymentType.HYBRID) {
                pointsPrice = Math.round(this.computePointsPrice(p.regularPrice) * (1 - salePercent / 100));
            }
            item.product.salePercent = salePercent;
            item.product.salePrice = salePrice;
            item.product.pointsPrice = pointsPrice;
        }
        return cart;
    }
    async getCartHistory(userId) {
        return this.cartModel
            .find({ user: userId, checkedOut: true })
            .sort({ createdAt: -1 })
            .populate('items.product');
    }
};
exports.CartsService = CartsService;
exports.CartsService = CartsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(3, (0, mongoose_1.InjectModel)(sale_campaign_schema_1.SaleCampaign.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], CartsService);
//# sourceMappingURL=carts.service.js.map