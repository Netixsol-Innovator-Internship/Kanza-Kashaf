// src/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

export enum Category {
  TSHIRTS = 't-shirts',
  SHORTS = 'shorts',
  SHIRTS = 'shirts',
  HOODIE = 'hoodie',
  JEANS = 'jeans',
}

export enum Color {
  GREEN = 'green',
  RED = 'red',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  BLUE = 'blue',
  NAVY = 'navy',
  PURPLE = 'purple',
  PINK = 'pink',
  WHITE = 'white',
  BLACK = 'black',
}

export enum Size {
  XXS = 'xx-small',
  XS = 'x-small',
  S = 'small',
  M = 'medium',
  L = 'large',
  XL = 'x-large',
  XXL = 'xx-large',
  XXXL = '3x-large',
  XXXXL = '4x-large',
}

export enum Style {
  CASUAL = 'casual',
  FORMAL = 'formal',
  PARTY = 'party',
  GYM = 'gym',
}

export enum PaymentType {
  MONEY = 'money',
  POINTS = 'points',
  HYBRID = 'hybrid',
}

@Schema()
export class VariantSize {
  @Prop({ enum: Size, required: true }) size: Size;
  @Prop({ required: true, default: 0 }) stock: number;
  @Prop({ required: false }) sku?: string;
}

export const VariantSizeSchema = SchemaFactory.createForClass(VariantSize);

@Schema()
export class ProductVariant {
  @Prop({ enum: Color, required: true }) color: Color;
  @Prop({ type: [String], required: true }) images: string[]; // must be 3 images
  @Prop({ type: [VariantSizeSchema], default: [] }) sizes: VariantSize[];
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) description: string;
  @Prop({ enum: Category, required: true }) category: Category;

  // optional style field (added)
  @Prop({ enum: Style, required: false }) style?: Style;

  @Prop({ required: false }) brand?: string;

  @Prop({ required: true }) regularPrice: number; // PKR
  @Prop({ enum: PaymentType, default: PaymentType.MONEY }) paymentType: PaymentType;

  // first-purchase discount percent (e.g., 20)
  @Prop({ default: 0 }) discountPercent: number;

  // scheduled sale (product-level)
  @Prop({ default: 0 }) salePercent: number;
  @Prop({ type: Date, default: null }) saleStartAt?: Date | null;
  @Prop({ type: Date, default: null }) saleEndAt?: Date | null;

  // computed (denormalized) values for convenience
  @Prop({ default: 0 }) pointsPrice: number; // integer
  @Prop({ default: 0 }) ratingAvg: number;
  @Prop({ default: 0 }) ratingCount: number;

  @Prop({ type: [ProductVariantSchema], default: [] }) variants: ProductVariant[];

  @Prop({ default: true }) active: boolean;

  // salesCount for top-selling sorting
  @Prop({ default: 0 }) salesCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
