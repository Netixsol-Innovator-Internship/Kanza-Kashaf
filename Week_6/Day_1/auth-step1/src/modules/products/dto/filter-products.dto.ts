import { IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { Category, Color, Size, Style } from '../../../schemas/product.schema';
import { ApiProperty } from '@nestjs/swagger';

export class FilterProductsDto {
  @ApiProperty({ enum: Category, example: Category.TSHIRTS, required: false })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiProperty({ example: 1000, required: false })
  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @ApiProperty({ example: 5000, required: false })
  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @ApiProperty({ enum: Color, example: [Color.BLACK, Color.WHITE], required: false, isArray: true })
  @IsOptional()
  @IsArray()
  colors?: Color[];

  @ApiProperty({ enum: Size, example: [Size.S, Size.M], required: false, isArray: true })
  @IsOptional()
  @IsArray()
  sizes?: Size[];

  @ApiProperty({ enum: Style, example: [Style.CASUAL], required: false, isArray: true })
  @IsOptional()
  @IsArray()
  styles?: Style[];

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
