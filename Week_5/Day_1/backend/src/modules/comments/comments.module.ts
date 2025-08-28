import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsGateway } from './comments.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  providers: [CommentsService, CommentsGateway],
  controllers: [CommentsController],
  exports: [CommentsService],
})
export class CommentsModule {}
