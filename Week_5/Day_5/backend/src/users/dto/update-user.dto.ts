// update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() fullName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() nationality?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() idType?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() idNumber?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() avatar?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() username?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
}
