import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
  PaymentType,
} from '../../schemas/product.schema';
import { Review, ReviewDocument } from '../../schemas/review.schema';
import {
  SaleCampaign,
  SaleCampaignDocument,
} from '../../schemas/sale-campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { CloudinaryService } from './cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(SaleCampaign.name)
    private campaignModel: Model<SaleCampaignDocument>,
    private cloudinary: CloudinaryService,
    private notifications: NotificationsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  private campaignTimer: NodeJS.Timer | null = null;

  onModuleInit() {
    // Poll every 30 seconds for campaign start/end to send notifications
    this.campaignTimer = setInterval(() => {
      this.processCampaignNotifications().catch(() => {});
    }, 30_000);
  }

  onModuleDestroy() {
    if (this.campaignTimer) {
      clearInterval(this.campaignTimer as any);
      this.campaignTimer = null;
    }
  }

  // ✅ 100 PKR = 1 point
  private computePointsPrice(regularPrice: number) {
    return Math.round(regularPrice / 100);
  }

  private async computeEffectiveSalePercent(product: ProductDocument) {
    const now = new Date();
    let maxPercent = 0;

    if (
      product.salePercent &&
      product.salePercent > 0 &&
      product.saleStartAt &&
      product.saleEndAt
    ) {
      if (
        new Date(product.saleStartAt) <= now &&
        new Date(product.saleEndAt) >= now
      ) {
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
      if (c.percent && c.percent > maxPercent) maxPercent = c.percent;
    }

    return maxPercent;
  }

  private computeSalePrice(price: number, percent: number) {
    if (!percent || percent <= 0) return price;
    return Math.round(price * (1 - percent / 100));
  }

  async createProduct(dto: CreateProductDto) {
    if (dto.variants) {
      for (const v of dto.variants) {
        if (!v.images || v.images.length < 3) {
          throw new BadRequestException(
            'Each variant must include at least 3 images',
          );
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

    if (
      dto.paymentType === PaymentType.POINTS ||
      dto.paymentType === PaymentType.HYBRID
    ) {
      product.pointsPrice = this.computePointsPrice(dto.regularPrice);
    } else {
      product.pointsPrice = 0;
    }

    await product.save();

    // 🔔 Send NEW ARRIVAL notification
    try {
      await this.notifications.sendNewArrivalNotification(
        product._id.toString(),
        product.name,
      );
    } catch (e) {}

    // emit realtime product created event
    try {
      const salePercent = await this.computeEffectiveSalePercent(product);
      const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
      this.notifications.emitEvent(`product-updated:${product._id.toString()}`, {
        ...product.toObject(),
        salePercent,
        salePrice,
      });
    } catch (e) {}

    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const prevSalePercent = product.salePercent || 0;

    if (dto.name) product.name = dto.name;
    if (dto.description) product.description = dto.description;
    if (dto.category) product.category = dto.category as any;
    if (dto.brand !== undefined) product.brand = dto.brand;
    if (dto.regularPrice !== undefined)
      product.regularPrice = dto.regularPrice;
    if (dto.paymentType !== undefined)
      product.paymentType = dto.paymentType as any;
    if (dto.discountPercent !== undefined)
      product.discountPercent = dto.discountPercent;
    if (dto.salePercent !== undefined) product.salePercent = dto.salePercent;
    if (dto.saleStartAt !== undefined)
      product.saleStartAt = dto.saleStartAt ? new Date(dto.saleStartAt) : null;
    if (dto.saleEndAt !== undefined)
      product.saleEndAt = dto.saleEndAt ? new Date(dto.saleEndAt) : null;
    if (dto.variants !== undefined) product.variants = dto.variants as any;

    if (
      product.paymentType === PaymentType.POINTS ||
      product.paymentType === PaymentType.HYBRID
    ) {
      product.pointsPrice = this.computePointsPrice(product.regularPrice);
    } else {
      product.pointsPrice = 0;
    }

    await product.save();

    // 🔔 SALE notifications
    try {
      if (
        product.salePercent &&
        product.salePercent > 0 &&
        (!prevSalePercent || prevSalePercent === 0)
      ) {
        await this.notifications.sendSaleStartNotificationForProduct(
          product._id.toString(),
          product.name,
          product.salePercent,
        );
      } else if (
        (!product.salePercent || product.salePercent === 0) &&
        prevSalePercent > 0
      ) {
        await this.notifications.sendSaleEndNotificationForProduct(
          product._id.toString(),
          product.name,
        );
      }
    } catch (e) {}

    // 🔔 SOLD OUT notification for Admin/SuperAdmin
    try {
      const totalStock = (product.variants || []).reduce((sum, v) => {
        return (
          sum +
          (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0)
        );
      }, 0);

      if (totalStock <= 0) {
        await this.notifications.sendProductSoldOutNotification(
          product._id.toString(),
          product.name,
        );
      }
    } catch (e) {}

    // emit product updated realtime
    try {
      const salePercent = await this.computeEffectiveSalePercent(product);
      const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
      this.notifications.emitEvent(`product-updated:${product._id.toString()}`, {
        ...product.toObject(),
        salePercent,
        salePrice,
      });
    } catch (e) {}

    return product;
  }

  async deleteProduct(id: string) {
    const r = await this.productModel.findByIdAndDelete(id);
    if (!r) throw new NotFoundException('Product not found');
    return { ok: true };
  }

  async uploadImages(images: string[]) {
    if (!images || !images.length) {
      throw new BadRequestException('No images provided');
    }

    const results = [];
    for (const base64 of images) {
      const res = await this.cloudinary.uploadBase64(base64, 'products');
      results.push(res.url);
    }
    return results;
  }

  async getProduct(id: string) {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');

    const salePercent = await this.computeEffectiveSalePercent(product as ProductDocument);
    const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
    const pointsPrice =
      product.paymentType !== PaymentType.MONEY
        ? Math.round(this.computePointsPrice(product.regularPrice) * (1 - salePercent / 100))
        : 0;

    return { ...product, salePercent, salePrice, pointsPrice };
  }

  async listProducts(filters: FilterProductsDto) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 12);

    const q: any = { active: true };
    if (filters.category) q.category = filters.category;
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
    
    // console.log("itemssssss::::", items)
    const itemsWithSale = await Promise.all(
      items.map(async (p: any) => {
        const salePercent = await this.computeEffectiveSalePercent(
          p as ProductDocument,
        );
        const salePrice = this.computeSalePrice(p.regularPrice, salePercent);
        return {
          ...p,
          salePercent,
          salePrice,
          pointsPrice:
            p.paymentType !== PaymentType.MONEY
              ? Math.round(
                  this.computePointsPrice(p.regularPrice) *
                    (1 - salePercent / 100),
                )
              : 0,
        };
      }),
    );


    return { items: itemsWithSale, total, page, limit };
  }

  private async userHasPurchasedProduct(userId: string, productId: string) {
    const modelNames = this.connection.modelNames();
    if (!modelNames.includes('Order')) {
      return true;
    }
    const orderModel = this.connection.model('Order') as any;
    const userObjectId = new Types.ObjectId(userId);

    // Robust check via aggregation to handle multiple storage shapes
    let productObjectId: Types.ObjectId | null = null;
    try {
      productObjectId = new Types.ObjectId(productId);
    } catch (e) {
      productObjectId = null;
    }

    const matchAnyProduct = [] as any[];
    if (productObjectId) {
      matchAnyProduct.push({ 'items.product': productObjectId });
      matchAnyProduct.push({ 'items.product._id': productObjectId });
    }
    matchAnyProduct.push({ 'items.product': productId });
    matchAnyProduct.push({ 'items.product._id': productId });

    const exprOr: any[] = [];
    if (productObjectId) {
      exprOr.push({ $eq: [ '$items.product', productObjectId ] });
      exprOr.push({ $eq: [ '$items.product._id', productObjectId ] });
    }
    // string comparisons
    exprOr.push({ $eq: [ { $toString: '$items.product' }, productId ] });
    exprOr.push({ $eq: [ { $toString: '$items.product._id' }, productId ] });

    const agg = await orderModel.aggregate([
      {
        $match: {
          completed: true,
        },
      },
      {
        $match: {
          $expr: { $eq: [ { $toString: '$user' }, userId ] },
        },
      },
      { $unwind: '$items' },
      { $match: { $expr: { $or: exprOr } } },
      { $limit: 1 },
      { $project: { _id: 1 } },
    ]);

    if (Array.isArray(agg) && agg.length > 0) return true;

    // Fallback 1: $elemMatch based check (covers ObjectId and string as stored)
    const elemOr: any[] = [];
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
    if (count > 0) return true;

    // Fallback 2: simple dot-notation findOne
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

  async addOrUpdateReview(
    userId: string,
    productId: string,
    rating: number,
    comment?: string,
  ) {
    rating = Math.max(1, Math.min(5, Math.floor(rating)));

    const canReview = await this.userHasPurchasedProduct(userId, productId);
    if (!canReview)
      throw new ForbiddenException('Only buyers can review this product');

    let review = await this.reviewModel.findOne({
      user: userId,
      product: productId,
    });
    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = await this.reviewModel.create({
        user: userId,
        product: productId,
        rating,
        comment,
      });
    }

    await this.recalculateProductRating(productId);

    try {
      await this.notifications.sendUserNotification(
        userId,
        'REVIEW_SUBMITTED',
        'Your review was submitted',
      );
    } catch (e) {}

    // 🔴 Realtime: emit review-added and product-updated events
    try {
      const populated = await this.reviewModel
        .findById(review._id)
        .populate('user', 'name')
        .lean();

      // emit single review added
      this.notifications.emitEvent(`review-added:${productId}`, populated);

      // emit product updated (rating change)
      const product = await this.productModel.findById(productId).lean();
      const salePercent = await this.computeEffectiveSalePercent(product as ProductDocument);
      const salePrice = this.computeSalePrice(product.regularPrice, salePercent);

      this.notifications.emitEvent(`product-updated:${productId}`, {
        ...product,
        salePercent,
        salePrice,
      });
    } catch (e) {
      // ignore
    }

    return review;
  }

  async deleteReview(userId: string, productId: string, reviewId: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    if (review.user.toString() !== userId) throw new ForbiddenException('Not allowed');

    await review.deleteOne();
    await this.recalculateProductRating(productId);
    return { ok: true };
  }

  private async recalculateProductRating(productId: string) {
    const agg = await this.reviewModel.aggregate([
      { $match: { product: new Types.ObjectId(productId) } },
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

  async createCampaign(dto: CreateCampaignDto) {
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
    
    // Do not notify at creation time if startAt is in the future. A scheduler will handle.
    return doc;
  }

  // Called periodically (e.g., via external cron hitting an endpoint) to process campaign start/end notifications
  async processCampaignNotifications() {
    const now = new Date();
    const toStart = await this.campaignModel.find({ startAt: { $lte: now }, startNotified: false });
    for (const c of toStart) {
      try { await this.notifications.sendSaleStartGlobal(c.name, c.percent); } catch {}
      c.startNotified = true;
      await c.save();
    }

    const toEnd = await this.campaignModel.find({ endAt: { $lte: now }, endNotified: false });
    for (const c of toEnd) {
      try { await this.notifications.sendSaleEndGlobal(c.name); } catch {}
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

    const itemsWithSale = await Promise.all(
      items.map(async (p: any) => {
        const salePercent = await this.computeEffectiveSalePercent(p as ProductDocument);
        const salePrice = this.computeSalePrice(p.regularPrice, salePercent);

        let pointsPrice = 0;
        if (p.paymentType === PaymentType.POINTS || p.paymentType === PaymentType.HYBRID) {
          pointsPrice = Math.round(
            this.computePointsPrice(p.regularPrice) * (1 - salePercent / 100),
          );
        }

        return {
          ...p,
          salePercent,
          salePrice,
          paymentType: p.paymentType,
          pointsPrice,
        };
      }),
    );

    return itemsWithSale;
  }

  async getTopSelling(limit = 15) {
    const items = await this.productModel
      .find({ active: true })
      .sort({ salesCount: -1 })
      .limit(limit)
      .lean();

    const itemsWithSale = await Promise.all(
      items.map(async (p: any) => {
        const salePercent = await this.computeEffectiveSalePercent(
          p as ProductDocument,
        );
        const salePrice = this.computeSalePrice(p.regularPrice, salePercent);

        let pointsPrice = 0;
        if (p.paymentType === PaymentType.POINTS || p.paymentType === PaymentType.HYBRID) {
          pointsPrice = Math.round(
            this.computePointsPrice(p.regularPrice) * (1 - salePercent / 100),
          );
        }

        return {
          ...p,
          salePercent,
          salePrice,
          paymentType: p.paymentType,
          pointsPrice,
        };
      }),
    );

    return itemsWithSale;
  }

  // NEW: fetch paginated reviews for product
  async getReviews(productId: string, page = 1, limit = 6, sort: 'latest' | 'oldest' = 'latest') {
    const skip = (page - 1) * limit;
    const sortObj: Record<string, import('mongoose').SortOrder> = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

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

  // NEW: fetch top-rated reviews globally
  async getTopRatedReviews(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.reviewModel
        .find({})
        .sort({ rating: -1, createdAt: -1 }) // highest rating first, newest first within same rating
        .skip(skip)
        .limit(limit)
        .populate('user', 'name') // include user name
        .populate('product', 'name') // optional: include product name
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

}
