import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true }) authorId: string;
  @Prop({ required: true }) authorDisplayName: string;
  @Prop({ default: '' }) authorProfilePic: string;
  @Prop({ required: true }) content: string;
  @Prop() parentId?: string;
  @Prop({ type: [String], default: [] }) likes: string[];
}
export const CommentSchema = SchemaFactory.createForClass(Comment);