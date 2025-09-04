import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
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
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(SaleCampaign.name)
    private campaignModel: Model<SaleCampaignDocument>,
    private cloudinary: CloudinaryService,
    private notifications: NotificationsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

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

    const salePercent = await this.computeEffectiveSalePercent(
      product as ProductDocument,
    );
    const salePrice = this.computeSalePrice(product.regularPrice, salePercent);
    const pointsPrice =
      product.paymentType !== PaymentType.MONEY
        ? Math.round(
            this.computePointsPrice(product.regularPrice) *
              (1 - salePercent / 100),
          )
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
    const found = await orderModel.findOne({
      user: new Types.ObjectId(userId),
      'items.product': new Types.ObjectId(productId),
      completed: true,
    });
    return !!found;
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

    return review;
  }

  async deleteReview(userId: string, productId: string, reviewId: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    if (review.user.toString() !== userId)
      throw new ForbiddenException('Not allowed');

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
    return doc;
  }

  async listActiveCampaigns() {
    const now = new Date();
    return this.campaignModel.find({
      startAt: { $lte: now },
      endAt: { $gte: now },
    });
  }
}
