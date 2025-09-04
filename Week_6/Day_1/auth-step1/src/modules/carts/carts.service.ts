import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from '../../schemas/cart.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private notifications: NotificationsService,
  ) {}

  private async getOrCreateCurrentCart(userId: string) {
    const user = await this.userModel.findById(userId).populate('cart');
    if (!user) throw new NotFoundException('User not found');

    let cart = await this.cartModel.findOne({ user: userId, checkedOut: false });
    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
      user.cart.push(cart._id);
      await user.save();
    }
    return cart;
  }

  async addProduct(
    userId: string,
    productId: string,
    quantity: number,
    color?: string,
    size?: string,
  ) {
    const cart = await this.getOrCreateCurrentCart(userId);
    const product = await this.productModel.findById(productId);

    if (!product) throw new NotFoundException('Product not found');

    // --- Stock check ---
    const variant = (product.variants || []).find(
      (v) => !color || v.color === color,
    );

    if (variant) {
      if (size) {
        const sizeObj = variant.sizes.find((s) => s.size === size);
        if (!sizeObj || sizeObj.stock <= 0 || quantity > sizeObj.stock) {
          await this.notifications.sendOutOfStockNotification(userId, product.name);
          throw new BadRequestException('Requested size out of stock');
        }
      } else {
        const totalStock = (variant.sizes || []).reduce(
          (sum, s) => sum + (s.stock || 0),
          0,
        );
        if (totalStock <= 0) {
          await this.notifications.sendOutOfStockNotification(userId, product.name);
          throw new BadRequestException('Variant out of stock');
        }
      }
    } else if (!variant && (color || size)) {
      await this.notifications.sendOutOfStockNotification(userId, product.name);
      throw new BadRequestException('Variant not found');
    }

    const existing = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.color === color &&
        i.size === size,
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
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

  async updateProduct(
    userId: string,
    productId: string,
    quantity: number,
    color?: string,
    size?: string,
  ) {
    const cart = await this.getOrCreateCurrentCart(userId);
    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.color === color &&
        i.size === size,
    );

    if (!item) throw new NotFoundException('Product not in cart');

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) =>
          !(
            i.product.toString() === productId &&
            i.color === color &&
            i.size === size
          ),
      );
    } else {
      // check stock again before updating
      const product = await this.productModel.findById(productId);
      if (!product) throw new NotFoundException('Product not found');

      const variant = (product.variants || []).find(
        (v) => !color || v.color === color,
      );

      if (variant) {
        if (size) {
          const sizeObj = variant.sizes.find((s) => s.size === size);
          if (!sizeObj || sizeObj.stock < quantity) {
            await this.notifications.sendOutOfStockNotification(userId, product.name);
            throw new BadRequestException('Not enough stock');
          }
        }
      }

      item.quantity = quantity;
    }

    await cart.save();
    return cart;
  }

  async removeProduct(
    userId: string,
    productId: string,
    color?: string,
    size?: string,
  ) {
    const cart = await this.getOrCreateCurrentCart(userId);
    cart.items = cart.items.filter(
      (i) =>
        !(
          i.product.toString() === productId &&
          i.color === color &&
          i.size === size
        ),
    );
    await cart.save();
    return cart;
  }

  async getCurrentCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ user: userId, checkedOut: false })
      .populate('items.product');
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async getCartHistory(userId: string) {
    return this.cartModel
      .find({ user: userId, checkedOut: true })
      .sort({ createdAt: -1 })
      .populate('items.product');
  }
}
