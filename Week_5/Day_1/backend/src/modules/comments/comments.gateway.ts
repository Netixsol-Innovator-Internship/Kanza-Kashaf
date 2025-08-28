import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: { origin: process.env.ORIGIN || 'http://localhost:3000', credentials: true },
})
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // Optional: verify JWT from query if provided for identification
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers['authorization']?.toString()?.replace('Bearer ', '');
    if (token) {
      try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET as string);
        (client as any).userId = payload.userId;
      } catch {}
    }
  }

  handleDisconnect(client: Socket) {}

  emitToOthers(event: string, payload: any, senderUserId: string) {
    // broadcast to everyone except the sender
    this.server.sockets.sockets.forEach((sock: any) => {
      if (sock.userId !== senderUserId) {
        sock.emit(event, payload);
      }
    });
  }

  emitToActor(event: string, payload: any, targetUserId: string) {
    // Emit only to sockets belonging to the actor (targetUserId).
    // Useful for actor-specific notifications (edit/delete) so only the actor receives them.
    this.server.sockets.sockets.forEach((sock: any) => {
      if (sock.userId === targetUserId) {
        sock.emit(event, payload);
      }
    });
  }
}
