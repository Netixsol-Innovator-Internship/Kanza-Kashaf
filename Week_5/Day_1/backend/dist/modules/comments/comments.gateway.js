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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt = require("jsonwebtoken");
let CommentsGateway = class CommentsGateway {
    handleConnection(client) {
        var _a, _b, _c;
        const token = ((_a = client.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) ||
            ((_c = (_b = client.handshake.headers['authorization']) === null || _b === void 0 ? void 0 : _b.toString()) === null || _c === void 0 ? void 0 : _c.replace('Bearer ', ''));
        if (token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                client.userId = payload.userId;
            }
            catch (_d) { }
        }
    }
    handleDisconnect(client) { }
    emitToOthers(event, payload, senderUserId) {
        this.server.sockets.sockets.forEach((sock) => {
            if (sock.userId !== senderUserId) {
                sock.emit(event, payload);
            }
        });
    }
    emitToActor(event, payload, targetUserId) {
        this.server.sockets.sockets.forEach((sock) => {
            if (sock.userId === targetUserId) {
                sock.emit(event, payload);
            }
        });
    }
};
exports.CommentsGateway = CommentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommentsGateway.prototype, "server", void 0);
exports.CommentsGateway = CommentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: process.env.ORIGIN || 'http://localhost:3000', credentials: true },
    })
], CommentsGateway);
//# sourceMappingURL=comments.gateway.js.map