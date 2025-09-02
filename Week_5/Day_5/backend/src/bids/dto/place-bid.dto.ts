import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, Min } from 'class-validator';

export class PlaceBidDto {
  @ApiProperty() @IsMongoId() auctionId: string;
  @ApiProperty() @IsNumber() @Min(1) amount: number;
}
