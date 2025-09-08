import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../common/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class LikesViaCommentsController {
  constructor(private readonly likes: LikesService) {}

  @Post(':id/like')
  async toggleLike(@Req() req, @Param('id') id: string) {
    return this.likes.toggleLike(req.user.sub, id);
  }
}