import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max, IsArray, IsDateString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Winter Sale' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Discounts on all winter products', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 20, description: 'Discount percent (0–100)' })
  @IsNumber()
  @Min(1)
  @Max(100)
  percent: number;

  @ApiProperty({ example: ['64efc9f2d2...'], required: false })
  @IsOptional()
  @IsArray()
  productIds?: string[];

  @ApiProperty({ example: ['t-shirts', 'hoodie'], required: false })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiProperty({ example: '2025-09-01T00:00:00.000Z' })
  @IsDateString()
  startAt: Date;

  @ApiProperty({ example: '2025-09-15T23:59:59.000Z' })
  @IsDateString()
  endAt: Date;
}
