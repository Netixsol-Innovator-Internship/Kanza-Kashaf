import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/jwt.guard';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { WsGateway } from '../../ws/ws.gateway';

@Controller('follow')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(
    private users: UsersService,
    private notifs: NotificationsService,
    private ws: WsGateway,
  ) {}

  @Post(':id')
  async follow(@Req() req, @Param('id') id: string) {
    await this.users.follow(req.user.sub, id);
    if (id !== req.user.sub) {
      this.ws.emitToUser(id, 'follow', { by: req.user.sub });
      await this.notifs.create({ userId: id, actorId: req.user.sub, type: 'follow', message: 'You have a new follower', targetUserId: req.user.sub });
    }
    return { ok: true };
  }

  @Post(':id/unfollow')
  async unfollow(@Req() req, @Param('id') id: string) {
    await this.users.unfollow(req.user.sub, id);
    if (id !== req.user.sub) {
      this.ws.emitToUser(id, 'unfollow', { by: req.user.sub });
      await this.notifs.create({ userId: id, actorId: req.user.sub, type: 'unfollow', message: 'unfollowed you', targetUserId: req.user.sub });
    }
    return { ok: true };
  }
}