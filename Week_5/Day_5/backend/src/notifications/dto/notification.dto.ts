import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({ example: '64f9a8d7c9e4a4a12b3d4567', description: 'User ID' })
  userId: string;

  @ApiProperty({
    example: 'auction_started',
    enum: [
      'auction_started',
      'new_bid',
      'auction_won',
      'auction_ended',
      'wishlist_updated',   // ✅ add
      'auction_created',    // ✅ optional
    ],
  })
  type: string;

  @ApiProperty({ example: { auctionId: '64f9...', message: '...' } })
  data: any;

  @ApiProperty({ example: false })
  read: boolean;

  @ApiProperty({ example: '2025-08-29T12:34:56.789Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-29T12:34:56.789Z' })
  updatedAt: Date;
}
