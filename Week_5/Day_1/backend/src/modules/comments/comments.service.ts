import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private model: Model<Comment>) {}

  async list(postId: string) {
    return this.model.find({ postId }).sort({ createdAt: 1 }).lean();
  }

  async create(data: {
    postId: string;
    userId: string;
    userName: string;
    text: string;
    parentId?: string | null;
  }) {
    const doc = new this.model({
      postId: data.postId,
      userId: new Types.ObjectId(data.userId),
      userName: data.userName,
      text: data.text,
      parentId: data.parentId ? new Types.ObjectId(data.parentId) : null,
      createdAt: new Date(),
    });
    await doc.save();
    return doc.toObject();
  }

  async update(id: string, userId: string, text: string) {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('Not found');
    if (doc.userId.toString() !== userId) throw new NotFoundException('Not found');
    doc.text = text;
    await doc.save();
    return doc.toObject();
  }

  async remove(id: string, userId: string) {
    const doc = await this.model.findById(id);
    if (!doc) throw new NotFoundException('Not found');
    if (doc.userId.toString() !== userId) throw new NotFoundException('Not found');
    await doc.deleteOne();
    return { ok: true };
  }
}
