import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { Review, ReviewSchema } from '../../schemas/review.schema';
import { SaleCampaign, SaleCampaignSchema } from '../../schemas/sale-campaign.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CloudinaryService } from './cloudinary.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: SaleCampaign.name, schema: SaleCampaignSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, CloudinaryService],
  exports: [ProductsService],
})
export class ProductsModule {}
