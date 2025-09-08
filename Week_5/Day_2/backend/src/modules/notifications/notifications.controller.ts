import { Controller, Get, Param, Patch, UseGuards, Req,Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/jwt.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifs: NotificationsService) {}

  @Get()
  list(@Req() req) {
    return this.notifs.listForUser(req.user.sub);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const userId = req.user.sub;
    const count = await this.notifs.countUnread(userId);
    return { count };
  }

  @Patch(':id/read')
  read(@Req() req, @Param('id') id: string) {
    return this.notifs.markRead(req.user.sub, id);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.notifs.delete(req.user.sub, id);
  }
}