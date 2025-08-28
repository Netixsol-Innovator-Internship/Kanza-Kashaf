// likes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../comments/comment.schema';
import { WsGateway } from '../../ws/ws.gateway';
import { NotificationsService } from '../notifications/notifications.service'; // <-- new import

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly ws: WsGateway,
    private readonly notifs: NotificationsService, // <-- injected
  ) {}

  async toggleLike(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const hasLiked = comment.likes.some((id: any) => id.toString() === userId);

    if (hasLiked) {
      // remove (unlike)
      comment.likes = comment.likes.filter((id: any) => id.toString() !== userId);
    } else {
      // add (like)
      comment.likes.push(userId);
    }

    await comment.save();

    // Build payload with both likes array and count and metadata
    const payload = {
      commentId: comment._id.toString(),
      likes: comment.likes.map((id: any) => id.toString()), // array of userIds
      count: comment.likes.length,
      liked: !hasLiked,
      actorId: userId,
      commentOwnerId: comment.authorId,
    };

    // Emit to everyone (including actor). Frontend will avoid duplicate toasts for actor.
    try {
      // server property exists on injected WsGateway
      if ((this.ws as any).server && typeof (this.ws as any).server.emit === 'function') {
        (this.ws as any).server.emit('comment.liked', payload);
      } else {
        // fallback: emit to comment owner + all except actor
        this.ws.emitToUser(comment.authorId, 'comment.liked', payload);
        this.ws.emitToAllExceptActor('comment.liked', payload, userId);
      }
    } catch (err) {
      // don't crash the operation if socket emit fails
    }

    // --- NEW: create a Notification only when this is a new like (not an unlike)
    // and don't notify the user about their own like.
    if (!hasLiked && comment.authorId !== userId) {
      try {
        await this.notifs.create({
          userId: comment.authorId,
          actorId: userId,
          type: 'like',
          message: 'Someone liked your comment',
          commentId: comment._id.toString(),
        });
        // NotificationsService.create will emit 'notification.new' to the recipient,
        // which your frontend listens for to increment the unread count.
      } catch (err) {
        // don't block like action if notif creation fails
        // optionally log the error
      }
    }

    // Also return the minimal object for the HTTP response
    return {
      commentId: payload.commentId,
      likes: payload.count,
      liked: payload.liked,
    };
  }
}
