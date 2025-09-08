// src/modules/orders/orders.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, PipelineStage } from 'mongoose';
import { Cart, CartDocument } from '../../schemas/cart.schema';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { SaleCampaign, SaleCampaignDocument } from '../../schemas/sale-campaign.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(SaleCampaign.name) private campaignModel: Model<SaleCampaignDocument>,
    @InjectConnection() private readonly connection: Connection,
    private notifications: NotificationsService,
  ) {}

  // --- Pricing helpers (align with cart/products) ---
  private computePointsPrice(regularPrice: number) {
    return Math.round(regularPrice / 100);
  }

  private async computeEffectiveSalePercent(product: ProductDocument | any) {
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

  // ---------- checkout ----------
  async checkout(
    userId: string,
    cartId: string,
    paymentMethod: string,
    pointsUsed: number,
    hybridSelections: { productId: string; method: 'money' | 'points' }[] = [],
  ) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const cart = await this.cartModel
        .findById(cartId)
        .populate('items.product')
        .session(session);
      if (!cart) throw new NotFoundException('Cart not found');
      if (cart.user.toString() !== userId)
        throw new ForbiddenException('Not your cart');
      if (cart.checkedOut)
        throw new BadRequestException('Cart already checked out');

      const user = await this.userModel.findById(userId).session(session);
      if (!user) throw new NotFoundException('User not found');

      const deliveryFee = 200;
      const discount = 0;

      // hybrid logic
      const hybridMap = new Map<string, 'money' | 'points'>();
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
        const product = item.product as unknown as ProductDocument;
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
          const unitPoints =
            item.unitPointsPrice && item.unitPointsPrice > 0
              ? item.unitPointsPrice
              : Math.round(this.computePointsPrice(product.regularPrice) * (1 - salePercent / 100));
          totalPointsItems += unitPoints * item.quantity;
        } else if (productPaymentType === 'money') {
          hasMoneyProducts = true;
          const unitMoney =
            item.unitPrice && item.unitPrice > 0
              ? item.unitPrice
              : product.regularPrice || 0;
          totalMoneyItems += unitMoney * item.quantity;
        } else if (productPaymentType === 'hybrid') {
          hasHybridProducts = true;
          const chosen = hybridMap.get(String(product._id));
          if (!chosen) {
            throw new BadRequestException(
              `Missing hybrid selection for product ${product._id}.`,
            );
          }
          if (chosen === 'points') {
            const unitPoints =
              item.unitPointsPrice && item.unitPointsPrice > 0
                ? item.unitPointsPrice
                : Math.round(this.computePointsPrice(product.regularPrice) * (1 - salePercent / 100));
            totalPointsItems += unitPoints * item.quantity;
          } else {
            const unitMoney =
              item.unitPrice && item.unitPrice > 0
                ? item.unitPrice
                : product.regularPrice || 0;
            totalMoneyItems += unitMoney * item.quantity;
          }
        } else {
          const unitMoney =
            item.unitPrice && item.unitPrice > 0
              ? item.unitPrice
              : product.regularPrice || 0;
          totalMoneyItems += unitMoney * item.quantity;
        }
      }

      const distinctTypes = new Set<string>();
      if (hasMoneyProducts) distinctTypes.add('money');
      if (hasPointsOnlyProducts) distinctTypes.add('points');
      if (hasHybridProducts) distinctTypes.add('hybrid');

      const isMixed = distinctTypes.size > 1 || hasHybridProducts;
      if (isMixed && paymentMethod.toLowerCase() !== 'hybrid') {
        throw new BadRequestException('This cart requires Hybrid payment method.');
      }

      const totalMoney = totalMoneyItems + deliveryFee - discount;
      const totalPoints = totalPointsItems;

      if (paymentMethod.toLowerCase() === 'points') {
        if (hasMoneyProducts) {
          throw new BadRequestException(
            'Cart contains money-only products; cannot pay fully by points.',
          );
        }
        if (user.loyaltyPoints < totalPoints) {
          throw new BadRequestException(
            'Insufficient loyalty points to complete this order',
          );
        }
        user.loyaltyPoints -= totalPoints;
      } else if (paymentMethod.toLowerCase() === 'hybrid') {
        if (user.loyaltyPoints < totalPoints) {
          throw new BadRequestException(
            'Insufficient loyalty points for hybrid payment',
          );
        }
        user.loyaltyPoints -= totalPoints;
        const pointsEarned = Math.floor(totalMoneyItems / 100);
        user.loyaltyPoints += pointsEarned;
      } else {
        if (pointsUsed > user.loyaltyPoints)
          throw new BadRequestException('Not enough points');
        const pointsEarned = Math.floor(totalMoneyItems / 100);
        user.loyaltyPoints = user.loyaltyPoints - pointsUsed + pointsEarned;
      }

      const orderArr = await this.orderModel.create(
        [
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
            pointsUsed:
              paymentMethod.toLowerCase() === 'points'
                ? totalPoints
                : paymentMethod.toLowerCase() === 'hybrid'
                ? totalPoints
                : pointsUsed,
            pointsEarned:
              paymentMethod.toLowerCase() === 'points'
                ? 0
                : Math.floor(totalMoneyItems / 100),
            completed: true,
          },
        ],
        { session },
      );

      cart.checkedOut = true;
      await cart.save({ session });

      user.orders.push(orderArr[0]._id);
      await user.save({ session });

      try {
        await this.notifications.sendPaymentAcceptedNotification(
          userId,
          orderArr[0]._id.toString(),
        );
      } catch (e) {}

      try {
        this.notifications.emitEvent('order-created', {
          order: orderArr[0],
          userId,
        });
      } catch (e) {}

      for (const item of cart.items) {
        const product = await this.productModel.findById(item.product).session(session);
        if (!product) continue;

        const totalStock = (product.variants || []).reduce(
          (sum, v) =>
            sum + (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0),
          0,
        );

        if (totalStock <= 0) {
          try {
            await this.notifications.sendProductSoldOutNotification(
              product._id.toString(),
              product.name,
            );
          } catch (e) {}
        }
      }

      await session.commitTransaction();
      session.endSession();
      return orderArr[0];
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('items.product');
    if (!order) throw new NotFoundException('Order not found');
    if (order.user.toString() !== userId)
      throw new ForbiddenException('Not your order');
    return order;
  }

  async getOrderHistory(userId: string) {
    return this.orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product');
  }

  // ---------- Admin helpers ----------
  async getAdminStats() {
    const totalOrders = await this.orderModel.countDocuments();
    const completedOrders = await this.orderModel.countDocuments({ completed: true });
    const activeOrders = await this.orderModel.countDocuments({ completed: false });
    const returnedOrders = 0;
    return { totalOrders, activeOrders, completedOrders, returnedOrders };
  }

  async getSalesGraph(range: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    const match = { completed: true };
    let groupStage: any;

    if (range === 'daily') {
      groupStage = {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: '$total' },
      };
    } else if (range === 'weekly') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          week: { $isoWeek: '$createdAt' },
        },
        total: { $sum: '$total' },
      };
    } else {
      groupStage = {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$total' },
      };
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $group: groupStage },
      { $sort: { _id: 1 } },
    ];

    const raw = await this.orderModel.aggregate(pipeline);

    const result = raw.map((r: any) => {
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
    const pipeline: PipelineStage[] = [
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

  async getOrderAdmin(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('user', 'name email')
      .populate('items.product');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
