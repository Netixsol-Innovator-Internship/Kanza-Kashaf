import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { Role, UserDocument } from '../../schemas/user.schema';
import { Model } from 'mongoose';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private config;
    private userModel;
    server: Server;
    private logger;
    private userSockets;
    constructor(config: ConfigService, userModel: Model<UserDocument>);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    sendToUser(userId: string, event: string, payload: any): void;
    sendToRole(role: Role, event: string, payload: any): void;
    sendRoleChangedNotification(userId: string, newRole: string): Promise<void>;
    sendBlockStatusNotification(userId: string, blocked: boolean): Promise<void>;
    broadcast(event: string, payload: any): void;
}
