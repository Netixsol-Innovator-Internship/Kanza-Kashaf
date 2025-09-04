import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../schemas/user.schema';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth('jwt')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // ---------- PRODUCTS ----------
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @ApiBody({ type: CreateProductDto })
  async create(@Body() dto: CreateProductDto) {
    return this.products.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.products.updateProduct(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.products.deleteProduct(id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.products.getProduct(id);
  }

  @Post('filter')
  @ApiBody({ type: FilterProductsDto })
  async filter(@Body() dto: FilterProductsDto) {
    return this.products.listProducts(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('upload')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', example: 'data:image/png;base64,...' },
        },
      },
    },
  })
  async uploadImages(@Body('images') images: string[]) {
    return this.products.uploadImages(images);
  }

  // ---------- REVIEWS ----------
  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  @ApiBody({ type: CreateReviewDto })
  async addOrUpdateReview(
    @Req() req,
    @Param('id') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.products.addOrUpdateReview(
      req.user.userId,
      productId,
      dto.rating,
      dto.comment,
    );
  }

  // ---------- SALE CAMPAIGNS ----------
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('campaigns')
  @ApiBody({ type: CreateCampaignDto })
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.products.createCampaign(dto);
  }

  @Get('campaigns/active')
  async listActiveCampaigns() {
    return this.products.listActiveCampaigns();
  }
}
