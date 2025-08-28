import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CommentsGateway } from './comments.gateway';

@Controller('comments')
export class CommentsController {
  constructor(private svc: CommentsService, private gateway: CommentsGateway) {}

  @Get()
  list(@Query('postId') postId: string) {
    return this.svc.list(postId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() dto: CreateCommentDto, @CurrentUser() user: any) {
    const comment = await this.svc.create({
      postId: dto.postId,
      text: dto.text,
      userId: user.userId,
      userName: user.username,
      parentId: dto.parentId ?? null,
    });
    // Emit to others (not back to sender) via gateway
    this.gateway.emitToOthers('comment:new', comment, user.userId);
    return comment;
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @CurrentUser() user: any) {
    const updated = await this.svc.update(id, user.userId, dto.text);
    this.gateway.emitToActor('comment:update', updated, user.userId);
    return updated;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.svc.remove(id, user.userId);
    this.gateway.emitToActor('comment:delete', { id }, user.userId);
    return { ok: true };
  }
}
