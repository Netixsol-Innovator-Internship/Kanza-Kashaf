import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @ApiProperty({ example: 'Street 12' })
  @IsString()
  addressLine1: string;

  @ApiProperty({ example: 'Lahore' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Punjab' })
  @IsString()
  province: string;

  @ApiProperty({ example: 'PK' })
  @IsString()
  country: string;

  @ApiProperty({ example: '54000' })
  @IsString()
  postalCode: string;
}

export enum OrderPaymentMethod {
  MONEY = 'money',
  POINTS = 'points',
  HYBRID = 'hybrid',
}

export class HybridSelectionDto {
  @ApiProperty({ example: '64f9a2b...' })
  @IsString()
  productId: string;

  @ApiProperty({ enum: ['money', 'points'], example: 'money' })
  @IsEnum(['money', 'points'] as any)
  method: 'money' | 'points';
}

export class CheckoutDto {
  @ApiProperty({ type: AddressDto })
  address: AddressDto;

  @ApiProperty({ enum: OrderPaymentMethod, example: OrderPaymentMethod.MONEY })
  @IsEnum(OrderPaymentMethod)
  paymentMethod: OrderPaymentMethod;

  @ApiProperty({ required: false, description: 'Use existing cart id. If omitted, active cart is used.' })
  @IsOptional()
  @IsString()
  cartId?: string;

  @ApiProperty({ required: false, description: 'When paymentMethod=hybrid, provide selections', type: [HybridSelectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HybridSelectionDto)
  hybridSelections?: HybridSelectionDto[];
}
