import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { Cart, CartDocument } from '../../schemas/cart.schema';
import { Order, OrderDocument } from '../../schemas/order.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection,
    private notifications: NotificationsService,
  ) {}

  async checkout(
    userId: string,
    cartId: string,
    paymentMethod: string,
    pointsUsed: number,
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

      // compute subtotal
      const subtotal = cart.items.reduce((acc, item: any) => {
        const price = item.product.regularPrice;
        return acc + price * item.quantity;
      }, 0);

      const deliveryFee = 15;
      const discount = 0; // placeholder for campaigns
      const total = subtotal + deliveryFee - discount;

      const pointsEarned = Math.floor(subtotal / 100);
      if (pointsUsed > user.loyaltyPoints)
        throw new BadRequestException('Not enough points');

      user.loyaltyPoints = user.loyaltyPoints - pointsUsed + pointsEarned;

      const order = await this.orderModel.create(
        [
          {
            user: userId,
            cart: cart._id,
            items: cart.items,
            address: user.addresses?.[0] || null,
            deliveryFee,
            discount,
            subtotal,
            total,
            paymentMethod,
            pointsUsed,
            pointsEarned,
            completed: true,
          },
        ],
        { session },
      );

      // update cart
      cart.checkedOut = true;
      await cart.save({ session });

      // update user
      user.orders.push(order[0]._id);
      await user.save({ session });

      // 🔔 Payment Accepted notification
      try {
        await this.notifications.sendPaymentAcceptedNotification(
          userId,
          order[0]._id.toString(),
        );
      } catch (e) {}

      // 🔔 Sold Out checks
      for (const item of cart.items) {
        const product = await this.productModel.findById(item.product).session(session);
        if (!product) continue;

        const totalStock = (product.variants || []).reduce(
          (sum, v) => sum + (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0),
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

      return order[0];
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

  async getAllOrders() {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.product');
  }
}
