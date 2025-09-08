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
  Query,
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

  // ---------- NEW ARRIVALS ----------
  @Get('new-arrivals')
  async getNewArrivals(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 15;
    const p = page ? parseInt(page, 10) : 1;

    const items = await this.products.getNewArrivals(l);
    return {
      items,
      total: items.length,
      page: p,
      limit: l,
    };
  }

  // ---------- TOP SELLING ----------
  @Get('top-selling')
  async getTopSelling(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const l = limit ? parseInt(limit, 10) : 15;
    const p = page ? parseInt(page, 10) : 1;

    const items = await this.products.getTopSelling(l);
    return {
      items,
      total: items.length,
      page: p,
      limit: l,
    };
  }

  // ---------- LIST with query filters ----------
  // GET /products?category=...&styles=casual,formal&colors=red,blue&sizes=small,medium&page=1&limit=12&priceMin=1000&priceMax=5000
  @Get()
  async list(@Query() query: any) {
    const dto: FilterProductsDto = {};

    if (query.category) dto.category = query.category;
    if (query.priceMin) dto.priceMin = Number(query.priceMin);
    if (query.priceMax) dto.priceMax = Number(query.priceMax);
    if (query.page) dto.page = Number(query.page);
    if (query.limit) dto.limit = Number(query.limit);

    const parseArray = (v: string | string[] | undefined) => {
      if (!v) return undefined;
      if (Array.isArray(v)) return v;
      return (v as string).split(',').map((s) => s.trim()).filter(Boolean);
    };

    const colors = parseArray(query.colors);
    const sizes = parseArray(query.sizes);
    const styles = parseArray(query.styles);

    if (colors) dto.colors = colors as any;
    if (sizes) dto.sizes = sizes as any;
    if (styles) dto.styles = styles as any;

    return this.products.listProducts(dto);
  }

  // ---------- NEW: get product reviews (paginated & sortable) ----------
  // GET /products/:id/reviews?page=1&limit=6&sort=latest
  @Get(':id/reviews')
  async getReviews(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 6;
    const s = sort === 'oldest' ? 'oldest' : 'latest';
    return this.products.getReviews(id, p, l, s as 'latest' | 'oldest');
  }

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

  // GET /products/reviews/top-rated?page=1&limit=10
  @Get('reviews/top-rated')
  async getTopRatedReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 10;
    return this.products.getTopRatedReviews(p, l);
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
