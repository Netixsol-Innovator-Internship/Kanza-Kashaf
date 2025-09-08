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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../../schemas/product.schema");
const review_schema_1 = require("../../schemas/review.schema");
const sale_campaign_schema_1 = require("../../schemas/sale-campaign.schema");
const cloudinary_service_1 = require("./cloudinary.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ProductsService = class ProductsService {
    constructor(productModel, reviewModel, campaignModel, cloudinary, notifications, connection) {
        this.productModel = productModel;
        this.reviewModel = reviewModel;
        this.campaignModel = campaignModel;
        this.cloudinary = cloudinary;
        this.notifications = notifications;
        this.connection = connection;
        this.campaignTimer = null;
    }
    onModuleInit() {
        this.campaignTimer = setInterval(() => {
            this.processCampaignNotifications().catch(() => { });
        }, 30000);
    }
    onModuleDestroy() {
        if (this.campaignTimer) {
            clearInterval(this.campaignTimer);
            this.campaignTimer = null;
        }
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
    computeSalePrice(price, percent) {
        if (!percent || percent <= 0)
            return price;
        return Math.round(price * (1 - percent / 100));
    }
    async createProduct(dto) {
        if (dto.variants) {
            for (const v of dto.variants) {
                if (!v.images || v.images.length < 3) {
                    throw new common_1.BadRequestException('Each variant must include at least 3 images');
                }
            }
        }
        const product = new this.productModel({
            name: dto.name,
            description: dto.description,
            category: dto.category,
            brand: dto.brand,
            regularPrice: dto.regularPrice,
            paymentType: dto.paymentType,
            discountPercent: dto.discountPercent || 0,
            variants: dto.variants || [],
            salePercent: 0,
        });
        if (dto.paymentType === product_schema_1.PaymentType.POINTS ||
            dto.paymentType === product_schema_1.PaymentType.HYBRID) {
            product.pointsPrice = this.computePointsPrice(dto.regularPrice);
        }
        else {
            product.pointsPrice = 0;
        }
        await product.save();
        try {
            await this.notifications.sendNewArrivalNotification(product._id.toString(), product.name);
        }
        catch (e) { }
        try {
            const salePercent = await this.computeEffectiveSalePercent(product);
            const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
            this.notifications.emitEvent(`product-updated:${product._id.toString()}`, {
                ...product.toObject(),
                salePercent,
                salePrice,
            });
        }
        catch (e) { }
        return product;
    }
    async updateProduct(id, dto) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const prevSalePercent = product.salePercent || 0;
        if (dto.name)
            product.name = dto.name;
        if (dto.description)
            product.description = dto.description;
        if (dto.category)
            product.category = dto.category;
        if (dto.brand !== undefined)
            product.brand = dto.brand;
        if (dto.regularPrice !== undefined)
            product.regularPrice = dto.regularPrice;
        if (dto.paymentType !== undefined)
            product.paymentType = dto.paymentType;
        if (dto.discountPercent !== undefined)
            product.discountPercent = dto.discountPercent;
        if (dto.salePercent !== undefined)
            product.salePercent = dto.salePercent;
        if (dto.saleStartAt !== undefined)
            product.saleStartAt = dto.saleStartAt ? new Date(dto.saleStartAt) : null;
        if (dto.saleEndAt !== undefined)
            product.saleEndAt = dto.saleEndAt ? new Date(dto.saleEndAt) : null;
        if (dto.variants !== undefined)
            product.variants = dto.variants;
        if (product.paymentType === product_schema_1.PaymentType.POINTS ||
            product.paymentType === product_schema_1.PaymentType.HYBRID) {
            product.pointsPrice = this.computePointsPrice(product.regularPrice);
        }
        else {
            product.pointsPrice = 0;
        }
        await product.save();
        try {
            if (product.salePercent &&
                product.salePercent > 0 &&
                (!prevSalePercent || prevSalePercent === 0)) {
                await this.notifications.sendSaleStartNotificationForProduct(product._id.toString(), product.name, product.salePercent);
            }
            else if ((!product.salePercent || product.salePercent === 0) &&
                prevSalePercent > 0) {
                await this.notifications.sendSaleEndNotificationForProduct(product._id.toString(), product.name);
            }
        }
        catch (e) { }
        try {
            const totalStock = (product.variants || []).reduce((sum, v) => {
                return (sum +
                    (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0));
            }, 0);
            if (totalStock <= 0) {
                await this.notifications.sendProductSoldOutNotification(product._id.toString(), product.name);
            }
        }
        catch (e) { }
        try {
            const salePercent = await this.computeEffectiveSalePercent(product);
            const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
            this.notifications.emitEvent(`product-updated:${product._id.toString()}`, {
                ...product.toObject(),
                salePercent,
                salePrice,
            });
        }
        catch (e) { }
        return product;
    }
    async deleteProduct(id) {
        const r = await this.productModel.findByIdAndDelete(id);
        if (!r)
            throw new common_1.NotFoundException('Product not found');
        return { ok: true };
    }
    async uploadImages(images) {
        if (!images || !images.length) {
            throw new common_1.BadRequestException('No images provided');
        }
        const results = [];
        for (const base64 of images) {
            const res = await this.cloudinary.uploadBase64(base64, 'products');
            results.push(res.url);
        }
        return results;
    }
    async getProduct(id) {
        const product = await this.productModel.findById(id).lean();
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const salePercent = await this.computeEffectiveSalePercent(product);
        const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
        const pointsPrice = product.paymentType !== product_schema_1.PaymentType.MONEY
            ? Math.round(this.computePointsPrice(product.regularPrice) * (1 - salePercent / 100))
            : 0;
        return { ...product, salePercent, salePrice, pointsPrice };
    }
    async listProducts(filters) {
        const page = Math.max(1, filters.page || 1);
        const limit = Math.min(100, filters.limit || 12);
        const q = { active: true };
        if (filters.category)
            q.category = filters.category;
        if (filters.styles && filters.styles.length)
            q.style = { $in: filters.styles };
        if (filters.colors && filters.colors.length)
            q['variants.color'] = { $in: filters.colors };
        if (filters.sizes && filters.sizes.length)
            q['variants.sizes.size'] = { $in: filters.sizes };
        if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
            if (filters.priceMin !== undefined)
                q.regularPrice = { ...(q.regularPrice || {}), $gte: filters.priceMin };
            if (filters.priceMax !== undefined)
                q.regularPrice = { ...(q.regularPrice || {}), $lte: filters.priceMax };
        }
        const [items, total] = await Promise.all([
            this.productModel
                .find(q)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            this.productModel.countDocuments(q),
        ]);
        const itemsWithSale = await Promise.all(items.map(async (p) => {
            const salePercent = await this.computeEffectiveSalePercent(p);
            const salePrice = this.computeSalePrice(p.regularPrice, salePercent);
            return {
                ...p,
                salePercent,
                salePrice,
                pointsPrice: p.paymentType !== product_schema_1.PaymentType.MONEY
                    ? Math.round(this.computePointsPrice(p.regularPrice) *
                        (1 - salePercent / 100))
                    : 0,
            };
        }));
        return { items: itemsWithSale, total, page, limit };
    }
    async userHasPurchasedProduct(userId, productId) {
        const modelNames = this.connection.modelNames();
        if (!modelNames.includes('Order')) {
            return true;
        }
        const orderModel = this.connection.model('Order');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        let productObjectId = null;
        try {
            productObjectId = new mongoose_2.Types.ObjectId(productId);
        }
        catch (e) {
            productObjectId = null;
        }
        const matchAnyProduct = [];
        if (productObjectId) {
            matchAnyProduct.push({ 'items.product': productObjectId });
            matchAnyProduct.push({ 'items.product._id': productObjectId });
        }
        matchAnyProduct.push({ 'items.product': productId });
        matchAnyProduct.push({ 'items.product._id': productId });
        const exprOr = [];
        if (productObjectId) {
            exprOr.push({ $eq: ['$items.product', productObjectId] });
            exprOr.push({ $eq: ['$items.product._id', productObjectId] });
        }
        exprOr.push({ $eq: [{ $toString: '$items.product' }, productId] });
        exprOr.push({ $eq: [{ $toString: '$items.product._id' }, productId] });
        const agg = await orderModel.aggregate([
            {
                $match: {
                    completed: true,
                },
            },
            {
                $match: {
                    $expr: { $eq: [{ $toString: '$user' }, userId] },
                },
            },
            { $unwind: '$items' },
            { $match: { $expr: { $or: exprOr } } },
            { $limit: 1 },
            { $project: { _id: 1 } },
        ]);
        if (Array.isArray(agg) && agg.length > 0)
            return true;
        const elemOr = [];
        if (productObjectId) {
            elemOr.push({ product: productObjectId });
            elemOr.push({ 'product._id': productObjectId });
        }
        elemOr.push({ product: productId });
        elemOr.push({ 'product._id': productId });
        const count = await orderModel.countDocuments({
            completed: true,
            items: { $elemMatch: { $or: elemOr } },
            $or: [
                { user: userObjectId },
                { user: userId },
            ],
        });
        if (count > 0)
            return true;
        const simple = await orderModel.findOne({
            completed: true,
            $and: [
                {
                    $or: [
                        { user: userObjectId },
                        { user: userId },
                    ],
                },
                {
                    $or: [
                        { 'items.product': productObjectId || productId },
                        { 'items.product._id': productObjectId || productId },
                    ],
                },
            ],
        });
        return !!simple;
    }
    async addOrUpdateReview(userId, productId, rating, comment) {
        rating = Math.max(1, Math.min(5, Math.floor(rating)));
        const canReview = await this.userHasPurchasedProduct(userId, productId);
        if (!canReview)
            throw new common_1.ForbiddenException('Only buyers can review this product');
        let review = await this.reviewModel.findOne({
            user: userId,
            product: productId,
        });
        if (review) {
            review.rating = rating;
            review.comment = comment;
            await review.save();
        }
        else {
            review = await this.reviewModel.create({
                user: userId,
                product: productId,
                rating,
                comment,
            });
        }
        await this.recalculateProductRating(productId);
        try {
            await this.notifications.sendUserNotification(userId, 'REVIEW_SUBMITTED', 'Your review was submitted');
        }
        catch (e) { }
        try {
            const populated = await this.reviewModel
                .findById(review._id)
                .populate('user', 'name')
                .lean();
            this.notifications.emitEvent(`review-added:${productId}`, populated);
            const product = await this.productModel.findById(productId).lean();
            const salePercent = await this.computeEffectiveSalePercent(product);
            const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
            this.notifications.emitEvent(`product-updated:${productId}`, {
                ...product,
                salePercent,
                salePrice,
            });
        }
        catch (e) {
        }
        return review;
    }
    async deleteReview(userId, productId, reviewId) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (review.user.toString() !== userId)
            throw new common_1.ForbiddenException('Not allowed');
        await review.deleteOne();
        await this.recalculateProductRating(productId);
        return { ok: true };
    }
    async recalculateProductRating(productId) {
        const agg = await this.reviewModel.aggregate([
            { $match: { product: new mongoose_2.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: '$product',
                    avg: { $avg: '$rating' },
                    count: { $sum: 1 },
                },
            },
        ]);
        const data = agg[0] || null;
        if (!data) {
            await this.productModel.findByIdAndUpdate(productId, {
                ratingAvg: 0,
                ratingCount: 0,
            });
            return;
        }
        await this.productModel.findByIdAndUpdate(productId, {
            ratingAvg: Math.round(data.avg),
            ratingCount: data.count,
        });
    }
    async createCampaign(dto) {
        const doc = new this.campaignModel({
            name: dto.name,
            description: dto.description,
            percent: dto.percent,
            productIds: dto.productIds || [],
            categories: dto.categories || [],
            startAt: new Date(dto.startAt),
            endAt: new Date(dto.endAt),
        });
        await doc.save();
        return doc;
    }
    async processCampaignNotifications() {
        const now = new Date();
        const toStart = await this.campaignModel.find({ startAt: { $lte: now }, startNotified: false });
        for (const c of toStart) {
            try {
                await this.notifications.sendSaleStartGlobal(c.name, c.percent);
            }
            catch { }
            c.startNotified = true;
            await c.save();
        }
        const toEnd = await this.campaignModel.find({ endAt: { $lte: now }, endNotified: false });
        for (const c of toEnd) {
            try {
                await this.notifications.sendSaleEndGlobal(c.name);
            }
            catch { }
            c.endNotified = true;
            await c.save();
        }
        return { started: toStart.length, ended: toEnd.length };
    }
    async listActiveCampaigns() {
        const now = new Date();
        return this.campaignModel.find({
            startAt: { $lte: now },
            endAt: { $gte: now },
        });
    }
    async getNewArrivals(limit = 15) {
        const items = await this.productModel
            .find({ active: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        const itemsWithSale = await Promise.all(items.map(async (p) => {
            const salePercent = await this.computeEffectiveSalePercent(p);
            const salePrice = this.computeSalePrice(p.regularPrice, salePercent);
            let pointsPrice = 0;
            if (p.paymentType === product_schema_1.PaymentType.POINTS || p.paymentType === product_schema_1.PaymentType.HYBRID) {
                pointsPrice = Math.round(this.computePointsPrice(p.regularPrice) * (1 - salePercent / 100));
            }
            return {
                ...p,
                salePercent,
                salePrice,
                paymentType: p.paymentType,
                pointsPrice,
            };
        }));
        return itemsWithSale;
    }
    async getTopSelling(limit = 15) {
        const items = await this.productModel
            .find({ active: true })
            .sort({ salesCount: -1 })
            .limit(limit)
            .lean();
        const itemsWithSale = await Promise.all(items.map(async (p) => {
            const salePercent = await this.computeEffectiveSalePercent(p);
            const salePrice = this.computeSalePrice(p.regularPrice, salePercent);
            let pointsPrice = 0;
            if (p.paymentType === product_schema_1.PaymentType.POINTS || p.paymentType === product_schema_1.PaymentType.HYBRID) {
                pointsPrice = Math.round(this.computePointsPrice(p.regularPrice) * (1 - salePercent / 100));
            }
            return {
                ...p,
                salePercent,
                salePrice,
                paymentType: p.paymentType,
                pointsPrice,
            };
        }));
        return itemsWithSale;
    }
    async getReviews(productId, page = 1, limit = 6, sort = 'latest') {
        const skip = (page - 1) * limit;
        const sortObj = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        const [items, total] = await Promise.all([
            this.reviewModel
                .find({ product: productId })
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .populate('user', 'name')
                .lean(),
            this.reviewModel.countDocuments({ product: productId }),
        ]);
        return {
            items,
            total,
            page,
            limit,
        };
    }
    async getTopRatedReviews(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.reviewModel
                .find({})
                .sort({ rating: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('user', 'name')
                .populate('product', 'name')
                .lean(),
            this.reviewModel.countDocuments({}),
        ]);
        return {
            items,
            total,
            page,
            limit,
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(2, (0, mongoose_1.InjectModel)(sale_campaign_schema_1.SaleCampaign.name)),
    __param(5, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        cloudinary_service_1.CloudinaryService,
        notifications_service_1.NotificationsService,
        mongoose_2.Connection])
], ProductsService);
//# sourceMappingURL=products.service.js.map