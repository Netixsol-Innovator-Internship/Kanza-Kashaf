// src/auctions/dto/create-auction.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsArray, Min, IsOptional, ArrayMinSize, ArrayMaxSize, IsDateString } from 'class-validator';

export class CreateAuctionDto {
  // Car fields
  @ApiProperty() @IsString() vin: string;
  @ApiProperty() @IsNumber() year: number;
  @ApiProperty() @IsString() make: string;
  @ApiProperty() @IsString() carModel: string;
  @ApiProperty() @IsNumber() mileage: number;
  @ApiProperty({ enum: ['4 Cylinder','6 Cylinder','8 Cylinder','10 Cylinder','12 Cylinder'] }) @IsEnum(['4 Cylinder','6 Cylinder','8 Cylinder','10 Cylinder','12 Cylinder']) engineSize: string;
  @ApiProperty({ enum: ['Original paint','Partially Repainted','Totally Repainted'] }) @IsEnum(['Original paint','Partially Repainted','Totally Repainted']) paint: string;
  @ApiProperty({ enum: ['Yes','No'] }) @IsEnum(['Yes','No']) hasGccSpecs: string;
  @ApiProperty({ required:false }) @IsOptional() @IsString() features?: string;
  @ApiProperty({ enum: ['Yes','No'] }) @IsEnum(['Yes','No']) accidentHistory: string;
  @ApiProperty({ enum: ['Yes','No'] }) @IsEnum(['Yes','No']) serviceHistory: string;
  @ApiProperty({ enum: ['Completely stock','Modified'] }) @IsEnum(['Completely stock','Modified']) modificationStatus: string;
  @ApiProperty() @IsNumber() @Min(0) minBid: number;
  @ApiProperty({ type: [String], minItems: 6, maxItems: 6 }) @IsArray() @ArrayMinSize(6) @ArrayMaxSize(6) photos: string[];

  // Auction fields
  @ApiProperty() @IsDateString() startTime: string;
  @ApiProperty() @IsDateString() endTime: string;
  @ApiProperty() @IsNumber() @Min(100) minIncrement: number;
}
