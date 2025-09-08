import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 15, description: 'Sale percent', required: false })
  @IsOptional()
  @IsNumber()
  salePercent?: number;

  @ApiProperty({ example: '2025-09-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  saleStartAt?: string;

  @ApiProperty({ example: '2025-09-15T23:59:59.000Z', required: false })
  @IsOptional()
  @IsDateString()
  saleEndAt?: string;

  @ApiProperty({ example: 1999, required: false })
  @IsOptional()
  @IsNumber()
  regularPrice?: number;
}
