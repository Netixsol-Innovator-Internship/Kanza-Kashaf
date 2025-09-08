import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { WsGateway } from '../../ws/ws.gateway';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    NotificationsModule,
    UsersModule,
    LikesModule,
  ],
  providers: [CommentsService, WsGateway],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}