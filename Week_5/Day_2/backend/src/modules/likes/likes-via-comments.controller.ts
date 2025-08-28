// likes-via-comments.controller.ts
import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../common/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class LikesViaCommentsController {
  constructor(private readonly likes: LikesService) {}

  @Post(':id/like')
  async toggleLike(@Req() req, @Param('id') id: string) {
    // delegates to the same service that emits the socket event
    return this.likes.toggleLike(req.user.sub, id);
  }
}
