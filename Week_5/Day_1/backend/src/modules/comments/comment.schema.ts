import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true }) postId: string;
  @Prop({ required: true, type: Types.ObjectId }) userId: Types.ObjectId;
  @Prop({ required: true }) userName: string;
  @Prop({ required: true }) text: string;
  @Prop({ type: Types.ObjectId, default: null }) parentId?: Types.ObjectId | null;
  @Prop({ default: Date.now }) createdAt: Date;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
