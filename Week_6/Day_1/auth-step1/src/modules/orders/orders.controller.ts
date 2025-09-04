import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../schemas/user.schema';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('checkout/:cartId')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        paymentMethod: {
          type: 'string',
          example: 'Money',
        },
        pointsUsed: {
          type: 'number',
          example: 100,
        },
      },
      required: ['paymentMethod'],
    },
  })
  @ApiOkResponse({
    description: 'Checkout the current cart and create an order',
    schema: {
      example: {
        _id: 'order001',
        user: 'user123',
        cart: 'cart123',
        subtotal: 2400,
        deliveryFee: 15,
        discount: 0,
        total: 2415,
        paymentMethod: 'Money',
        pointsUsed: 0,
        pointsEarned: 24,
        completed: true,
        createdAt: '2025-09-04T12:00:00Z',
      },
    },
  })
  async checkout(
    @Req() req,
    @Param('cartId') cartId: string,
    @Body() body: { paymentMethod: string; pointsUsed?: number },
  ) {
    return this.orders.checkout(
      req.user.userId,
      cartId,
      body.paymentMethod,
      body.pointsUsed || 0,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns a specific order belonging to the user',
    schema: {
      example: {
        _id: 'order001',
        user: 'user123',
        items: [
          { product: { _id: 'prod123', name: 'T-Shirt' }, quantity: 2 },
        ],
        subtotal: 2400,
        total: 2415,
      },
    },
  })
  async getOrder(@Req() req, @Param('id') id: string) {
    return this.orders.getOrder(req.user.userId, id);
  }

  // ✅ New
  @Get('history/me')
  @ApiOkResponse({
    description: 'Returns order history of the logged-in user',
    schema: {
      example: [
        {
          _id: 'order001',
          subtotal: 2400,
          total: 2415,
          completed: true,
          createdAt: '2025-08-30T11:00:00Z',
        },
      ],
    },
  })
  async getOrderHistory(@Req() req) {
    return this.orders.getOrderHistory(req.user.userId);
  }

  // ✅ New (Admin/SuperAdmin only)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin/all')
  @ApiOkResponse({
    description: 'Returns all orders in the system (admin only)',
    schema: {
      example: [
        {
          _id: 'order001',
          user: { _id: 'user123', name: 'John Doe', email: 'john@example.com' },
          subtotal: 2400,
          total: 2415,
          completed: true,
        },
      ],
    },
  })
  async getAllOrders() {
    return this.orders.getAllOrders();
  }
}
