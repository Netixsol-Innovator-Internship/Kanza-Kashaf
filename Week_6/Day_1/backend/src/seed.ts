// seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import {
  Product,
  ProductDocument,
  Category,
  Color,
  Size,
  Style,
  PaymentType,
} from './schemas/product.schema';
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productModel = app.get<Model<ProductDocument>>(
    getModelToken(Product.name),
  );

  console.log('🌱 Seeding products...');

  await productModel.deleteMany({}); // clear old products

  const products: Partial<Product>[] = [];

  // Restrict to defined colors
  const seedColors = Object.values(Color);
  const allCategories = Object.values(Category);
  const allStyles = Object.values(Style);
  const allPaymentTypes = Object.values(PaymentType);
  const allSizes = Object.values(Size);

  let skuCounter = 1;

  // Map categories/styles → Unsplash keyword base
  const imageKeywords: Record<string, string> = {
    [Category.SHIRTS]: 'shirt',
    [Category.TSHIRTS]: 'tshirt casual',
    [Category.SHORTS]: 'shorts casual',
  };

  // Helper: real Unsplash image set for color/category
  const sampleImages = (keyword: string, color: string) => [
    `https://source.unsplash.com/600x600/?${keyword},${color},front`,
    `https://source.unsplash.com/600x600/?${keyword},${color},side`,
    `https://source.unsplash.com/600x600/?${keyword},${color},back`,
  ];

  // compute points from price
  const computePointsPrice = (price: number) =>
    Math.round(price / 10) * 100; // example: 2999 → 3000 pts

  // pick N random unique items from an array
  function pickRandom<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  for (const category of allCategories) {
    for (const style of allStyles) {
      for (const paymentType of allPaymentTypes) {
        const basePrice = Math.floor(Math.random() * 3000) + 1000;
        const discountPercent = Math.random() > 0.7 ? 10 : 0;
        const salePercent = Math.random() > 0.5 ? 5 : 0;

        // ✅ Pick 3 random colors
        const selectedColors = pickRandom(seedColors, 3);

        const variants = selectedColors.map((color) => ({
          color,
          images: sampleImages(imageKeywords[category] || 'clothes', color.toLowerCase()),
          sizes: allSizes.map((size) => ({
            size,
            stock: Math.floor(Math.random() * 50) + 5,
            sku: `SKU-${skuCounter++}-${size}`,
          })),
        }));

        const product: Partial<Product> = {
          name: `${style.charAt(0).toUpperCase() + style.slice(1)} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          description: `A stylish ${style} ${category} available in 3 random colors and multiple sizes.`,
          category,
          regularPrice: basePrice,
          pointsPrice:
            paymentType !== PaymentType.MONEY
              ? Math.round(
                  computePointsPrice(basePrice) * (1 - salePercent / 100),
                )
              : 0,
          paymentType,
          discountPercent,
          salePercent,
          ratingAvg: parseFloat((Math.random() * 5).toFixed(1)),
          ratingCount: Math.floor(Math.random() * 100),
          variants,
          active: true,
        };

        products.push(product);
      }
    }
  }

  await productModel.insertMany(products);

  console.log(`✅ Seeded ${products.length} products`);
  await app.close();
}

bootstrap();
