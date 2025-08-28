import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: { origin: process.env.CLIENT_ORIGIN || '*' } })
export class WsGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // JWT in query token param
    const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.toString().replace('Bearer ', '');
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET as string);
      (client as any).userId = payload.sub;
      client.join(`user:${payload.sub}`);
      // Could ack
    } catch {
      client.disconnect();
    }
  }

  // Utility emitters
  emitToAllExceptActor(event: string, data: any, actorId: string) {
    this.server.sockets.sockets.forEach((sock: any) => {
      if (sock.userId && sock.userId !== actorId) {
        sock.emit(event, data);
      }
    });
  }
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
