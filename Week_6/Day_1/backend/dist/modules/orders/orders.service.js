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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("../../schemas/cart.schema");
const order_schema_1 = require("../../schemas/order.schema");
const user_schema_1 = require("../../schemas/user.schema");
const product_schema_1 = require("../../schemas/product.schema");
const sale_campaign_schema_1 = require("../../schemas/sale-campaign.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let OrdersService = class OrdersService {
    constructor(cartModel, orderModel, userModel, productModel, campaignModel, connection, notifications) {
        this.cartModel = cartModel;
        this.orderModel = orderModel;
        this.userModel = userModel;
        this.productModel = productModel;
        this.campaignModel = campaignModel;
        this.connection = connection;
        this.notifications = notifications;
    }
    computePointsPrice(regularPrice) {
        return Math.round(regularPrice / 100);
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
    async checkout(userId, cartId, paymentMethod, pointsUsed, hybridSelections = []) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const cart = await this.cartModel
                .findById(cartId)
                .populate('items.product')
                .session(session);
            if (!cart)
                throw new common_1.NotFoundException('Cart not found');
            if (cart.user.toString() !== userId)
                throw new common_1.ForbiddenException('Not your cart');
            if (cart.checkedOut)
                throw new common_1.BadRequestException('Cart already checked out');
            const user = await this.userModel.findById(userId).session(session);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const deliveryFee = 200;
            const discount = 0;
            const hybridMap = new Map();
            for (const s of hybridSelections) {
                if (s && s.productId && (s.method === 'money' || s.method === 'points')) {
                    hybridMap.set(String(s.productId), s.method);
                }
            }
            let totalMoneyItems = 0;
            let totalPointsItems = 0;
            let hasPointsOnlyProducts = false;
            let hasHybridProducts = false;
            let hasMoneyProducts = false;
            for (const item of cart.items) {
                const product = item.product;
                if (!product) {
                    const price = item.unitPrice || 0;
                    totalMoneyItems += price * item.quantity;
                    hasMoneyProducts = true;
                    continue;
                }
                const salePercent = await this.computeEffectiveSalePercent(product);
                const productPaymentType = product.paymentType || 'money';
                if (productPaymentType === 'points') {
                    hasPointsOnlyProducts = true;
                    const unitPoints = item.unitPointsPrice && item.unitPointsPrice > 0
                        ? item.unitPointsPrice
                        : Math.round(this.computePointsPrice(product.regularPrice) * (1 - salePercent / 100));
                    totalPointsItems += unitPoints * item.quantity;
                }
                else if (productPaymentType === 'money') {
                    hasMoneyProducts = true;
                    const unitMoney = item.unitPrice && item.unitPrice > 0
                        ? item.unitPrice
                        : product.regularPrice || 0;
                    totalMoneyItems += unitMoney * item.quantity;
                }
                else if (productPaymentType === 'hybrid') {
                    hasHybridProducts = true;
                    const chosen = hybridMap.get(String(product._id));
                    if (!chosen) {
                        throw new common_1.BadRequestException(`Missing hybrid selection for product ${product._id}.`);
                    }
                    if (chosen === 'points') {
                        const unitPoints = item.unitPointsPrice && item.unitPointsPrice > 0
                            ? item.unitPointsPrice
                            : Math.round(this.computePointsPrice(product.regularPrice) * (1 - salePercent / 100));
                        totalPointsItems += unitPoints * item.quantity;
                    }
                    else {
                        const unitMoney = item.unitPrice && item.unitPrice > 0
                            ? item.unitPrice
                            : product.regularPrice || 0;
                        totalMoneyItems += unitMoney * item.quantity;
                    }
                }
                else {
                    const unitMoney = item.unitPrice && item.unitPrice > 0
                        ? item.unitPrice
                        : product.regularPrice || 0;
                    totalMoneyItems += unitMoney * item.quantity;
                }
            }
            const distinctTypes = new Set();
            if (hasMoneyProducts)
                distinctTypes.add('money');
            if (hasPointsOnlyProducts)
                distinctTypes.add('points');
            if (hasHybridProducts)
                distinctTypes.add('hybrid');
            const isMixed = distinctTypes.size > 1 || hasHybridProducts;
            if (isMixed && paymentMethod.toLowerCase() !== 'hybrid') {
                throw new common_1.BadRequestException('This cart requires Hybrid payment method.');
            }
            const totalMoney = totalMoneyItems + deliveryFee - discount;
            const totalPoints = totalPointsItems;
            if (paymentMethod.toLowerCase() === 'points') {
                if (hasMoneyProducts) {
                    throw new common_1.BadRequestException('Cart contains money-only products; cannot pay fully by points.');
                }
                if (user.loyaltyPoints < totalPoints) {
                    throw new common_1.BadRequestException('Insufficient loyalty points to complete this order');
                }
                user.loyaltyPoints -= totalPoints;
            }
            else if (paymentMethod.toLowerCase() === 'hybrid') {
                if (user.loyaltyPoints < totalPoints) {
                    throw new common_1.BadRequestException('Insufficient loyalty points for hybrid payment');
                }
                user.loyaltyPoints -= totalPoints;
                const pointsEarned = Math.floor(totalMoneyItems / 100);
                user.loyaltyPoints += pointsEarned;
            }
            else {
                if (pointsUsed > user.loyaltyPoints)
                    throw new common_1.BadRequestException('Not enough points');
                const pointsEarned = Math.floor(totalMoneyItems / 100);
                user.loyaltyPoints = user.loyaltyPoints - pointsUsed + pointsEarned;
            }
            const orderArr = await this.orderModel.create([
                {
                    user: userId,
                    cart: cart._id,
                    items: cart.items,
                    address: user.addresses?.[0] || null,
                    deliveryFee,
                    discount,
                    subtotal: totalMoneyItems + totalPointsItems,
                    total: totalMoney,
                    paymentMethod,
                    pointsUsed: paymentMethod.toLowerCase() === 'points'
                        ? totalPoints
                        : paymentMethod.toLowerCase() === 'hybrid'
                            ? totalPoints
                            : pointsUsed,
                    pointsEarned: paymentMethod.toLowerCase() === 'points'
                        ? 0
                        : Math.floor(totalMoneyItems / 100),
                    completed: true,
                },
            ], { session });
            cart.checkedOut = true;
            await cart.save({ session });
            user.orders.push(orderArr[0]._id);
            await user.save({ session });
            try {
                await this.notifications.sendPaymentAcceptedNotification(userId, orderArr[0]._id.toString());
            }
            catch (e) { }
            try {
                this.notifications.emitEvent('order-created', {
                    order: orderArr[0],
                    userId,
                });
            }
            catch (e) { }
            for (const item of cart.items) {
                const product = await this.productModel.findById(item.product).session(session);
                if (!product)
                    continue;
                try {
                    const variant = (product.variants || []).find((v) => !item.color || v.color === item.color);
                    if (variant) {
                        if (item.size) {
                            const sz = (variant.sizes || []).find((s) => s.size === item.size);
                            if (sz) {
                                sz.stock = Math.max(0, (sz.stock || 0) - (item.quantity || 0));
                            }
                        }
                    }
                    product.salesCount = (product.salesCount || 0) + (item.quantity || 0);
                    await product.save({ session });
                    const remainingStock = (product.variants || []).reduce((sum, v) => sum + (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0), 0);
                    if (remainingStock <= 0) {
                        try {
                            await this.notifications.sendProductSoldOutNotification(product._id.toString(), product.name);
                        }
                        catch (e) { }
                    }
                    try {
                        const salePercent = await this.computeEffectiveSalePercent(product);
                        const salePrice = Math.round(product.regularPrice * (1 - salePercent / 100));
                        this.notifications.emitEvent(`product-updated:${product._id.toString()}`, {
                            ...product.toObject(),
                            salePercent,
                            salePrice,
                        });
                    }
                    catch (e) { }
                }
                catch (e) {
                }
            }
            await session.commitTransaction();
            session.endSession();
            return orderArr[0];
        }
        catch (err) {
            await session.abortTransaction();
            session.endSession();
            throw err;
        }
    }
    async getOrder(userId, orderId) {
        const order = await this.orderModel
            .findById(orderId)
            .populate('items.product');
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.user.toString() !== userId)
            throw new common_1.ForbiddenException('Not your order');
        return order;
    }
    async getOrderHistory(userId) {
        return this.orderModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('items.product');
    }
    async getAdminStats() {
        const totalOrders = await this.orderModel.countDocuments();
        const completedOrders = await this.orderModel.countDocuments({ completed: true });
        const activeOrders = await this.orderModel.countDocuments({ completed: false });
        const returnedOrders = 0;
        return { totalOrders, activeOrders, completedOrders, returnedOrders };
    }
    async getSalesGraph(range = 'monthly') {
        const match = { completed: true };
        let groupStage;
        if (range === 'daily') {
            groupStage = {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                total: { $sum: '$total' },
            };
        }
        else if (range === 'weekly') {
            groupStage = {
                _id: {
                    year: { $year: '$createdAt' },
                    week: { $isoWeek: '$createdAt' },
                },
                total: { $sum: '$total' },
            };
        }
        else {
            groupStage = {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                total: { $sum: '$total' },
            };
        }
        const pipeline = [
            { $match: match },
            { $group: groupStage },
            { $sort: { _id: 1 } },
        ];
        const raw = await this.orderModel.aggregate(pipeline);
        const result = raw.map((r) => {
            if (range === 'weekly') {
                return {
                    period: `${r._id.year}-W${String(r._id.week).padStart(2, '0')}`,
                    total: r.total || 0,
                };
            }
            return { period: r._id, total: r.total || 0 };
        });
        return result;
    }
    async getBestSellers(limit = 3) {
        const pipeline = [
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$items.product',
                    qtySold: { $sum: '$items.quantity' },
                    revenue: {
                        $sum: { $multiply: ['$product.regularPrice', '$items.quantity'] },
                    },
                    product: { $first: '$product' },
                },
            },
            { $sort: { revenue: -1 } },
            { $limit: limit },
            {
                $project: {
                    productId: '$_id',
                    name: '$product.name',
                    revenue: 1,
                    qtySold: 1,
                },
            },
        ];
        const agg = await this.orderModel.aggregate(pipeline);
        return agg;
    }
    async getRecentOrders(limit = 6) {
        return this.orderModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('user', 'name email')
            .populate('items.product');
    }
    async getAllOrders(page = 1, limit = 8) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.orderModel
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'name email')
                .populate('items.product'),
            this.orderModel.countDocuments(),
        ]);
        return {
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getOrderAdmin(orderId) {
        const order = await this.orderModel
            .findById(orderId)
            .populate('user', 'name email')
            .populate('items.product');
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(4, (0, mongoose_1.InjectModel)(sale_campaign_schema_1.SaleCampaign.name)),
    __param(5, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection,
        notifications_service_1.NotificationsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map