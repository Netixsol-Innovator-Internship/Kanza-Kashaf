import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'New quantity for the product' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
