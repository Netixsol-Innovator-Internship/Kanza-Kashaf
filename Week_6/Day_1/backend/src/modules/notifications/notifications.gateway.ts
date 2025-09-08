import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Role, User, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('NotificationsGateway');

  // userId -> set(socketId)
  private userSockets = new Map<string, Set<string>>();

  constructor(private config: ConfigService, @InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async handleConnection(client: Socket) {
    try {
      // Accept token from socket handshake auth (recommended) or Authorization header
      const token =
        client.handshake.auth?.token ||
        (client.handshake.headers && (client.handshake.headers['authorization'] as string)
          ? (client.handshake.headers['authorization'] as string).split(' ')[1]
          : null);

      if (token) {
        const secret = this.config.get('JWT_SECRET') || 'changeme_super_secret';
        try {
          const payload: any = jwt.verify(token, secret);
          const userId = payload.sub as string;

          client.data.userId = userId;

          // Resolve latest role from DB (do not trust token role)
          let role: Role | undefined;
          try {
            const user = await this.userModel.findById(userId);
            role = user?.role as Role;
          } catch {}

          if (role) {
            client.data.role = role;
            // Join rooms for easy broadcasting
            client.join(`user:${userId}`);
            client.join(`role:${role}`);
          } else {
            // Fallback: only user room
            client.join(`user:${userId}`);
          }

          // track sockets for this user
          const set = this.userSockets.get(userId) || new Set<string>();
          set.add(client.id);
          this.userSockets.set(userId, set);

          this.logger.log(`Socket ${client.id} connected for user ${userId} role ${role}`);
          return;
        } catch (err) {
          this.logger.log(`Socket ${client.id} connected with invalid token (still allowed, anonymous)`);
        }
      } else {
        this.logger.log(`Socket ${client.id} connected anonymously`);
      }
    } catch (err) {
      this.logger.error('Error during gateway connection handling', err);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const userId = client.data?.userId;
      if (userId) {
        const set = this.userSockets.get(userId);
        if (set) {
          set.delete(client.id);
          if (set.size === 0) this.userSockets.delete(userId);
        }
      }
      this.logger.log(`Socket disconnected: ${client.id}`);
    } catch (err) {
      this.logger.error('Error on disconnect', err);
    }
  }

  // Send to specific user (room)
  sendToUser(userId: string, event: string, payload: any) {
    try {
      this.server.to(`user:${userId}`).emit(event, payload);
    } catch (err) {
      this.logger.error('sendToUser error', err);
    }
  }

  // Send to all users of a role
  sendToRole(role: Role, event: string, payload: any) {
    try {
      this.server.to(`role:${role}`).emit(event, payload);
    } catch (err) {
      this.logger.error('sendToRole error', err);
    }
  }

   // 🔔 Notify when role is changed
  async sendRoleChangedNotification(userId: string, newRole: string) {
    this.server.emit('userRoleChanged', { userId, newRole });
  }

  // 🔔 Notify when block/unblock status is changed
  async sendBlockStatusNotification(userId: string, blocked: boolean) {
    this.server.emit('userBlockStatusChanged', { userId, blocked });
  }

  // Broadcast to everybody
  broadcast(event: string, payload: any) {
    try {
      this.server.emit(event, payload);
    } catch (err) {
      this.logger.error('broadcast error', err);
    }
  }
}
