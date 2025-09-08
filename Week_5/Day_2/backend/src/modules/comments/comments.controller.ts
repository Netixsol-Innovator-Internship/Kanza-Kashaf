import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { JwtAuthGuard } from '../../common/jwt.guard';
import { CommentsService } from './comments.service';

class CreateCommentDto {
  @IsNotEmpty() content: string;
  @IsOptional() parentId?: string;
}
class EditCommentDto {
  @IsNotEmpty() content: string;
}

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private comments: CommentsService) {}

  @Get()
  list() {
    return this.comments.list();
  }

  @Post()
  create(@Req() req, @Body() dto: CreateCommentDto) {
    return this.comments.create(req.user.sub, dto.content, dto.parentId);
  }

  @Patch(':id')
  edit(@Req() req, @Param('id') id: string, @Body() dto: EditCommentDto) {
    return this.comments.edit(id, req.user.sub, dto.content);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.comments.remove(id, req.user.sub);
  }

  @Post(':id/like')
  like(@Req() req, @Param('id') id: string) {
    return this.comments.likeToggle(id, req.user.sub);
  }
}