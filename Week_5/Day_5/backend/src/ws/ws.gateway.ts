import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' },
})
export class WsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwt: JwtService) {}

  // Authenticate socket and join user room
  async handleConnection(client: Socket) {
    try {
      // token can come from handshake auth (recommended) or query/header as fallback
      const token =
        (client.handshake.auth && (client.handshake.auth as any).token) ||
        (client.handshake.headers['authorization'] as string)?.replace('Bearer ', '') ||
        (client.handshake.query?.token as string);

      if (!token) {
        client.disconnect(true);
        return;
      }

      const payload: any = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = payload?.sub || payload?.userId || payload?._id;
      if (!userId) {
        client.disconnect(true);
        return;
      }

      // store minimal info and join personal room
      (client.data as any).userId = userId;
      client.join(`user:${userId}`);
    } catch (e) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('join_auction')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { auctionId: string }) {
    client.join(`auction:${data.auctionId}`);
    client.emit('joined', { room: `auction:${data.auctionId}` });
  }

  // ---- emit helpers ----
  emitAuction(auctionId: string, event: string, payload: any) {
    this.server.to(`auction:${auctionId}`).emit(event, payload);
  }

  emitGlobal(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  // ✅ new: emit to a single authenticated user
  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
