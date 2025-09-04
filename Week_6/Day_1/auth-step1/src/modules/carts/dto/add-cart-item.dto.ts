import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({
    example: '64efc9f2d2a7b9c123456789',
    description: 'Product ID from products collection',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'black', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 'medium', required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
