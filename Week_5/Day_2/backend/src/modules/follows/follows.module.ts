import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { FollowsController } from './follows.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { WsGateway } from '../../ws/ws.gateway';

@Module({
  imports: [UsersModule, NotificationsModule],
  controllers: [FollowsController],
  providers: [WsGateway],
})
export class FollowsModule {}