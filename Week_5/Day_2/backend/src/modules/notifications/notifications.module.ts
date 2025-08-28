// notifications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { JwtModule } from '@nestjs/jwt';
import { WsGateway } from '../../ws/ws.gateway';
import { UsersModule } from '../users/users.module'; // <-- add this

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    UsersModule, // <-- added so UsersService is available
  ],
  providers: [NotificationsService, WsGateway],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
