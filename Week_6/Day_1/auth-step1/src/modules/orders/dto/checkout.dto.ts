import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

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
}
