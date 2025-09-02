// src/auctions/auctions.controller.ts
import { Body, Controller, Get, Param, Post, Req, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuctionsService } from './auctions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAuctionDto } from './dto/create-auction.dto';

@ApiTags('auctions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateAuctionDto) {
    return this.auctionsService.create(req.user.userId, dto);
  }

  @Get()
  list(@Query() query: any) {
    return this.auctionsService.list(query);
  }

  @Get('mine')
  async getMine(@Req() req) {
    return this.auctionsService.findBySeller(req.user.userId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.auctionsService.get(id);
  }

  @Post(':id/end')
  end(@Param('id') id: string, @Req() req: any) {
    return this.auctionsService.endAuction(id, req.user.userId);
  }

  // ✅ Toggle wishlist
  @Post(':id/toggle-wishlist')
  async toggleWishlist(@Param('id') id: string, @Req() req: any) {
    return this.auctionsService.toggleWishlist(req.user.userId, id);
  }
}
