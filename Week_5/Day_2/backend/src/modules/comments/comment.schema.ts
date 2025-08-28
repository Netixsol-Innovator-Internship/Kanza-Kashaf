import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true }) authorId: string;

  // Embedded author display information for fast reads
  @Prop({ required: true }) authorDisplayName: string;
  @Prop({ default: '' }) authorProfilePic: string;

  @Prop({ required: true }) content: string;
  @Prop() parentId?: string; // single-level reply
  @Prop({ type: [String], default: [] }) likes: string[]; // userIds
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
