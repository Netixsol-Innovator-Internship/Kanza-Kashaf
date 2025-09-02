// src/ws/ws.module.ts
import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
