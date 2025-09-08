import { IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
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

export class UpdateUserDto {
  @ApiProperty({ example: 'Updated Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'mypassword123', required: false })
  @IsOptional()
  @IsString()
  oldPassword?: string; // old password required if new password provided

  @ApiProperty({ example: 'myNewPassword456', required: false })
  @IsOptional()
  @MinLength(6)
  newPassword?: string; // new password instead of overwriting directly

  @ApiProperty({
    required: false,
    type: [AddressDto],
    example: [
      {
        addressLine1: 'Street 12',
        city: 'Lahore',
        province: 'Punjab',
        country: 'PK',
        postalCode: '54000',
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}
