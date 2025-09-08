import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'heropage19@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  password: string;
}
