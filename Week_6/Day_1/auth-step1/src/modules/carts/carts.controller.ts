import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('carts')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly carts: CartsService) {}

  @Post('add/:productId')
  @ApiOperation({ summary: 'Add product to current cart' })
  @ApiBody({
    type: AddCartItemDto,
    examples: {
      default: {
        summary: 'Add Black T-Shirt (M) x2',
        value: {
          productId: '64efc9f2d2a7b9c123456789',
          color: 'black',
          size: 'medium',
          quantity: 2,
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        userId: '64efc8f2d2a7b9c987654321',
        items: [
          {
            productId: '64efc9f2d2a7b9c123456789',
            name: 'Classic Black T-Shirt',
            color: 'black',
            size: 'medium',
            quantity: 2,
            unitPrice: 2499,
            totalPrice: 4998,
          },
        ],
        totalItems: 2,
        totalPrice: 4998,
      },
    },
  })
  async addProduct(
    @Req() req,
    @Param('productId') productId: string,
    @Body() body: AddCartItemDto,
  ) {
    return this.carts.addProduct(
      req.user.userId,
      productId,
      body.quantity,
      body.color,
      body.size,
    );
  }

  @Patch('update/:productId')
  @ApiOperation({ summary: 'Update product quantity in cart' })
  @ApiBody({
    type: UpdateCartItemDto,
    examples: {
      default: {
        summary: 'Update quantity to 3',
        value: {
          quantity: 3,
          color: 'black',
          size: 'medium',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        userId: '64efc8f2d2a7b9c987654321',
        items: [
          {
            productId: '64efc9f2d2a7b9c123456789',
            name: 'Classic Black T-Shirt',
            color: 'black',
            size: 'medium',
            quantity: 3,
            unitPrice: 2499,
            totalPrice: 7497,
          },
        ],
        totalItems: 3,
        totalPrice: 7497,
      },
    },
  })
  async updateProduct(
    @Req() req,
    @Param('productId') productId: string,
    @Body() body: UpdateCartItemDto & { color?: string; size?: string },
  ) {
    return this.carts.updateProduct(
      req.user.userId,
      productId,
      body.quantity,
      body.color,
      body.size,
    );
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiBody({
    schema: {
      example: { color: 'black', size: 'medium' },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        ok: true,
        message: 'Product removed from cart',
        remainingItems: [],
        totalPrice: 0,
      },
    },
  })
  async removeProduct(
    @Req() req,
    @Param('productId') productId: string,
    @Body() body: { color?: string; size?: string },
  ) {
    return this.carts.removeProduct(
      req.user.userId,
      productId,
      body.color,
      body.size,
    );
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current active cart' })
  @ApiOkResponse({
    schema: {
      example: {
        userId: '64efc8f2d2a7b9c987654321',
        items: [
          {
            productId: '64efc9f2d2a7b9c123456789',
            name: 'Classic Black T-Shirt',
            color: 'black',
            size: 'medium',
            quantity: 2,
            unitPrice: 2499,
            totalPrice: 4998,
          },
        ],
        totalItems: 2,
        totalPrice: 4998,
      },
    },
  })
  async getCurrentCart(@Req() req) {
    return this.carts.getCurrentCart(req.user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get past carts (orders history)' })
  @ApiOkResponse({
    schema: {
      example: [
        {
          cartId: '64f0a1b2c3d4e5f678901234',
          createdAt: '2025-08-01T10:15:30.000Z',
          items: [
            {
              productId: '64efc9f2d2a7b9c123456789',
              name: 'Classic Black T-Shirt',
              color: 'black',
              size: 'medium',
              quantity: 2,
              unitPrice: 2499,
              totalPrice: 4998,
            },
            {
              productId: '64efc9f2d2a7b9c223456789',
              name: 'Denim Jeans',
              color: 'blue',
              size: 'large',
              quantity: 1,
              unitPrice: 3999,
              totalPrice: 3999,
            },
          ],
          totalItems: 3,
          totalPrice: 8997,
        },
      ],
    },
  })
  async getCartHistory(@Req() req) {
    return this.carts.getCartHistory(req.user.userId);
  }
}
