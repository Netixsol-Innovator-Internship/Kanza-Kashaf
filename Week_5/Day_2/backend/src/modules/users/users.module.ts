import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from './cloudinary.service';
import { WsGateway } from '../../ws/ws.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET })
  ],
  providers: [UsersService, CloudinaryService, WsGateway],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}