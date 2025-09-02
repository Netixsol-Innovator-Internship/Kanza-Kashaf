"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let WsGateway = class WsGateway {
    constructor(jwt) {
        this.jwt = jwt;
    }
    async handleConnection(client) {
        var _a, _b;
        try {
            const token = (client.handshake.auth && client.handshake.auth.token) ||
                ((_a = client.handshake.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) ||
                ((_b = client.handshake.query) === null || _b === void 0 ? void 0 : _b.token);
            if (!token) {
                client.disconnect(true);
                return;
            }
            const payload = this.jwt.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const userId = (payload === null || payload === void 0 ? void 0 : payload.sub) || (payload === null || payload === void 0 ? void 0 : payload.userId) || (payload === null || payload === void 0 ? void 0 : payload._id);
            if (!userId) {
                client.disconnect(true);
                return;
            }
            client.data.userId = userId;
            client.join(`user:${userId}`);
        }
        catch (e) {
            client.disconnect(true);
        }
    }
    handleJoin(client, data) {
        client.join(`auction:${data.auctionId}`);
        client.emit('joined', { room: `auction:${data.auctionId}` });
    }
    emitAuction(auctionId, event, payload) {
        this.server.to(`auction:${auctionId}`).emit(event, payload);
    }
    emitGlobal(event, payload) {
        this.server.emit(event, payload);
    }
    emitToUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
};
exports.WsGateway = WsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_auction'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WsGateway.prototype, "handleJoin", null);
exports.WsGateway = WsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], WsGateway);
//# sourceMappingURL=ws.gateway.js.map