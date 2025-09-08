import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../comments/comment.schema';
import { WsGateway } from '../../ws/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly ws: WsGateway,
    private readonly notifs: NotificationsService,
  ) {}

  async toggleLike(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const hasLiked = comment.likes.some((id: any) => id.toString() === userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter((id: any) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    const payload = {
      commentId: comment._id.toString(),
      likes: comment.likes.map((id: any) => id.toString()),
      count: comment.likes.length,
      liked: !hasLiked,
      actorId: userId,
      commentOwnerId: comment.authorId,
    };

    try {
      if ((this.ws as any).server && typeof (this.ws as any).server.emit === 'function') {
        (this.ws as any).server.emit('comment.liked', payload);
      } else {
        this.ws.emitToUser(comment.authorId, 'comment.liked', payload);
        this.ws.emitToAllExceptActor('comment.liked', payload, userId);
      }
    } catch (err) {
    }

    if (!hasLiked && comment.authorId !== userId) {
      try {
        await this.notifs.create({
          userId: comment.authorId,
          actorId: userId,
          type: 'like',
          message: 'liked your comment',
          commentId: comment._id.toString(),
        });
      } catch (err) {
      }
    }

    return {
      commentId: payload.commentId,
      likes: payload.count,
      liked: payload.liked,
    };
  }
}