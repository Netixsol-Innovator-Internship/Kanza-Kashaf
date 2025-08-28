import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString() @IsNotEmpty() postId: string;
  @IsString() @IsNotEmpty() text: string;
  @IsOptional() parentId?: string | null;
}

export class UpdateCommentDto {
  @IsString() @IsNotEmpty() text: string;
}
