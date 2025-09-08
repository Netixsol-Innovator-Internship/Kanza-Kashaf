import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: 'Rating between 1 and 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Great product!', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
