import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../common/jwt.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likes: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':commentId/toggle')
  async toggleLike(@Req() req, @Param('commentId') commentId: string) {
    return this.likes.toggleLike(req.user.sub, commentId);
  }
}