import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../schemas/user.schema';
import { Request } from 'express';
import { Notification } from '../../schemas/notification.schema';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

@ApiTags('notifications')
@ApiBearerAuth('jwt')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  // Default: current user's notifications (personal + role-wide)
  @Get()
  @ApiOkResponse({ type: [Notification] })
  async getMyNotifications(@Req() req: Request) {
    const currentUser = req.user as any;
    return this.notifications.findUserAndRoleNotifications(currentUser.userId, currentUser.role);
  }

  @Get('super-admin')
  @Roles(Role.SUPER_ADMIN)
  @ApiOkResponse({ type: [Notification] })
  async getSuperAdminNotifs() {
    return this.notifications.findSuperAdminNotifications();
  }

  @Get('user/:userId')
  @ApiOkResponse({ type: [Notification] })
  @ApiForbiddenResponse({ description: 'Not allowed to view other users notifications' })
  async getUserNotifications(@Param('userId') userId: string, @Req() req: Request) {
    const currentUser = req.user as any;

    // allow self or super_admin
    if (currentUser.role !== Role.SUPER_ADMIN && currentUser.userId !== userId) {
      throw new ForbiddenException('You can only access your own notifications');
    }

    // fetch both personal + role-wide
    return this.notifications.findUserAndRoleNotifications(userId, currentUser.role);
  }

  @Patch(':id/read')
  @ApiOkResponse({ type: Notification })
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    const notif = await this.notifications.markAsRead(id);
    const currentUser = req.user as any;

    if (notif.targetRole === Role.SUPER_ADMIN && currentUser.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admins can read this notification');
    }

    if (
      notif.user &&
      currentUser.role !== Role.SUPER_ADMIN &&
      notif.user.toString() !== currentUser.userId
    ) {
      throw new ForbiddenException('You can only read your own notifications');
    }

    return notif;
  }
}
