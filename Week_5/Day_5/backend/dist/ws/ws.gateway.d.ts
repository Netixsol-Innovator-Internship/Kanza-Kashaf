import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class WsGateway implements OnGatewayConnection {
    private readonly jwt;
    server: Server;
    constructor(jwt: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleJoin(client: Socket, data: {
        auctionId: string;
    }): void;
    emitAuction(auctionId: string, event: string, payload: any): void;
    emitGlobal(event: string, payload: any): void;
    emitToUser(userId: string, event: string, payload: any): void;
}
