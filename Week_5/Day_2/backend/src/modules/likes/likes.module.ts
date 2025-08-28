// likes.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { Comment, CommentSchema } from '../comments/comment.schema';
import { WsGateway } from '../../ws/ws.gateway';
import { LikesController } from './likes.controller';
import { LikesViaCommentsController } from './likes-via-comments.controller';
import { NotificationsModule } from '../notifications/notifications.module'; // <-- import notifications module

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    NotificationsModule, // <-- add here
  ],
  providers: [LikesService, WsGateway],
  controllers: [LikesController, LikesViaCommentsController],
  exports: [LikesService],
})
export class LikesModule {}
