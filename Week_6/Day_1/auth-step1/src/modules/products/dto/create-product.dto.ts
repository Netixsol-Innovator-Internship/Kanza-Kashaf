import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Category,
  Color,
  Size,
  Style,
  PaymentType,
} from '../../../schemas/product.schema';
import { ApiProperty } from '@nestjs/swagger';

class SizeDto {
  @ApiProperty({ example: Size.M })
  @IsEnum(Size)
  size: Size;

  @ApiProperty({ example: 20 })
  @IsNumber()
  stock: number;

  @ApiProperty({ example: 'SKU123-M' })
  @IsOptional()
  @IsString()
  sku?: string;
}

class VariantDto {
  @ApiProperty({ example: Color.BLACK })
  @IsEnum(Color)
  color: Color;

  @ApiProperty({
    example: [
      'https://example.com/images/product-black-1.jpg',
      'https://example.com/images/product-black-2.jpg',
      'https://example.com/images/product-black-3.jpg',
    ],
    description: 'Must include exactly 3 images',
  })
  @IsArray()
  @ArrayMinSize(3, { message: 'Each variant must include exactly 3 images' })
  images: string[];

  @ApiProperty({
    type: [SizeDto],
    example: [
      { size: Size.S, stock: 10, sku: 'TSHIRT-BLK-S' },
      { size: Size.M, stock: 15, sku: 'TSHIRT-BLK-M' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SizeDto)
  sizes: SizeDto[];
}

export class CreateProductDto {
  @ApiProperty({ example: 'Classic Black T-Shirt' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'A premium cotton black t-shirt for everyday wear.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: Category, example: Category.TSHIRTS })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ enum: Style, example: Style.CASUAL })
  @IsEnum(Style)
  style: Style;

  @ApiProperty({ example: 'Nike' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 2499, description: 'Price in PKR' })
  @IsNumber()
  regularPrice: number;

  @ApiProperty({ enum: PaymentType, example: PaymentType.MONEY })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({ example: 10, description: 'Discount percent for first purchase' })
  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @ApiProperty({
    type: [VariantDto],
    example: [
      {
        color: Color.BLACK,
        images: [
          'https://example.com/images/black1.jpg',
          'https://example.com/images/black2.jpg',
          'https://example.com/images/black3.jpg',
        ],
        sizes: [
          { size: Size.S, stock: 10, sku: 'TSHIRT-BLK-S' },
          { size: Size.M, stock: 15, sku: 'TSHIRT-BLK-M' },
        ],
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants?: VariantDto[];
}
