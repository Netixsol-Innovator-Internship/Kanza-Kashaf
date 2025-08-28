import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { WsGateway } from '../../ws/ws.gateway';
import { LikesService } from '../likes/likes.service';

import { JSDOM } from 'jsdom';
import * as createDOMPurify from 'dompurify';

import { UsersService } from '../users/users.service';

const window = new JSDOM('').window as any;
const DOMPurify = (createDOMPurify as any)(window);

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private model: Model<Comment>,
    private notifs: NotificationsService,
    private ws: WsGateway,
    private likesService: LikesService,
    private usersService: UsersService,
  ) {}

  async list() {
    return this.model.find({}).sort({ createdAt: 1 });
  }

  async create(authorId: string, content: string, parentId?: string) {
    if (parentId) {
      const parent = await this.model.findById(parentId);
      if (!parent) throw new NotFoundException('Parent not found');
      if (parent.parentId) throw new ForbiddenException('Only single-level replies allowed');
    }

    const safeContent = DOMPurify.sanitize(content || '');

    const author = await this.usersService.findById(authorId);
    const authorDisplayName = author?.displayName || author?.username || authorId;
    const authorProfilePic = author?.profilePic || '';

    const doc = await new this.model({
      authorId,
      authorDisplayName,
      authorProfilePic,
      content: safeContent,
      parentId,
    }).save();

    this.ws.emitToAllExceptActor('comment.created', { comment: doc }, authorId);

    if (parentId) {
      const parent = await this.model.findById(parentId);
      if (parent) {
        this.ws.emitToUser(parent.authorId, 'comment.replied', {
          authorId,
          parentAuthorId: parent.authorId,
          commentId: doc._id.toString(),
          content: doc.content,
        });

        await this.notifs.create({
          userId: parent.authorId,
          actorId: authorId,
          type: 'reply',
          message: 'Someone replied to your comment',
          commentId: doc.id,
        });
      }
    }

    return doc;
  }

  async edit(commentId: string, userId: string, content: string) {
    const comment = await this.model.findById(commentId);
    if (!comment) throw new NotFoundException('Not found');
    if (comment.authorId !== userId) throw new ForbiddenException('Not yours');

    const safe = DOMPurify.sanitize(content || '');
    comment.content = safe;
    await comment.save();

    this.ws.emitToUser(userId, 'comment.edited', { 
      commentId, 
      content: comment.content, 
      userId 
    });

    await this.notifs.create({
      userId,
      actorId: userId,
      type: 'edit',
      message: 'You edited your comment',
      commentId,
    });

    return comment;
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.model.findById(commentId);
    if (!comment) throw new NotFoundException('Not found');
    if (comment.authorId !== userId) throw new ForbiddenException('Not yours');

    await this.model.deleteOne({ _id: commentId });

    this.ws.emitToAllExceptActor('comment.deleted', { commentId }, userId);
    this.ws.emitToUser(userId, 'comment.deleted', { commentId, userId });

    await this.notifs.create({
      userId,
      actorId: userId,
      type: 'delete',
      message: 'You deleted your comment',
      commentId,
    });

    return { ok: true };
  }

  async likeToggle(commentId: string, userId: string) {
    return this.likesService.toggleLike(userId, commentId);
  }
}
