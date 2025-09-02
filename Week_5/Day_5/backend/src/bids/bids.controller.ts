import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BidsService } from './bids.service';
import { Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaceBidDto } from './dto/place-bid.dto';

@ApiTags('bids')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  place(@Req() req: any, @Body() dto: PlaceBidDto) {
    return this.bidsService.placeBid(req.user.userId, dto);
  }

  @Get('auction/:auctionId')
  async getBidsForAuction(@Param('auctionId') auctionId: string) {
    return this.bidsService.getBidsForAuction(auctionId);
  }
}
