"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("./schemas/product.schema");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const productModel = app.get((0, mongoose_1.getModelToken)(product_schema_1.Product.name));
    console.log('🌱 Seeding products...');
    await productModel.deleteMany({});
    const products = [];
    const seedColors = Object.values(product_schema_1.Color);
    const allCategories = Object.values(product_schema_1.Category);
    const allStyles = Object.values(product_schema_1.Style);
    const allPaymentTypes = Object.values(product_schema_1.PaymentType);
    const allSizes = Object.values(product_schema_1.Size);
    let skuCounter = 1;
    const imageKeywords = {
        [product_schema_1.Category.SHIRTS]: 'shirt',
        [product_schema_1.Category.TSHIRTS]: 'tshirt casual',
        [product_schema_1.Category.SHORTS]: 'shorts casual',
    };
    const sampleImages = (keyword, color) => [
        `https://source.unsplash.com/600x600/?${keyword},${color},front`,
        `https://source.unsplash.com/600x600/?${keyword},${color},side`,
        `https://source.unsplash.com/600x600/?${keyword},${color},back`,
    ];
    const computePointsPrice = (price) => Math.round(price / 10) * 100;
    function pickRandom(arr, n) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }
    for (const category of allCategories) {
        for (const style of allStyles) {
            for (const paymentType of allPaymentTypes) {
                const basePrice = Math.floor(Math.random() * 3000) + 1000;
                const discountPercent = Math.random() > 0.7 ? 10 : 0;
                const salePercent = Math.random() > 0.5 ? 5 : 0;
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
                const product = {
                    name: `${style.charAt(0).toUpperCase() + style.slice(1)} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    description: `A stylish ${style} ${category} available in 3 random colors and multiple sizes.`,
                    category,
                    regularPrice: basePrice,
                    pointsPrice: paymentType !== product_schema_1.PaymentType.MONEY
                        ? Math.round(computePointsPrice(basePrice) * (1 - salePercent / 100))
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
//# sourceMappingURL=seed.js.map