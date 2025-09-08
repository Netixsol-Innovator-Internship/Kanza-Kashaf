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
exports.NotificationsGateway = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
const user_schema_1 = require("../../schemas/user.schema");
const mongoose_2 = require("mongoose");
let NotificationsGateway = class NotificationsGateway {
    constructor(config, userModel) {
        this.config = config;
        this.userModel = userModel;
        this.logger = new common_1.Logger('NotificationsGateway');
        this.userSockets = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                (client.handshake.headers && client.handshake.headers['authorization']
                    ? client.handshake.headers['authorization'].split(' ')[1]
                    : null);
            if (token) {
                const secret = this.config.get('JWT_SECRET') || 'changeme_super_secret';
                try {
                    const payload = jwt.verify(token, secret);
                    const userId = payload.sub;
                    client.data.userId = userId;
                    let role;
                    try {
                        const user = await this.userModel.findById(userId);
                        role = user?.role;
                    }
                    catch { }
                    if (role) {
                        client.data.role = role;
                        client.join(`user:${userId}`);
                        client.join(`role:${role}`);
                    }
                    else {
                        client.join(`user:${userId}`);
                    }
                    const set = this.userSockets.get(userId) || new Set();
                    set.add(client.id);
                    this.userSockets.set(userId, set);
                    this.logger.log(`Socket ${client.id} connected for user ${userId} role ${role}`);
                    return;
                }
                catch (err) {
                    this.logger.log(`Socket ${client.id} connected with invalid token (still allowed, anonymous)`);
                }
            }
            else {
                this.logger.log(`Socket ${client.id} connected anonymously`);
            }
        }
        catch (err) {
            this.logger.error('Error during gateway connection handling', err);
        }
    }
    handleDisconnect(client) {
        try {
            const userId = client.data?.userId;
            if (userId) {
                const set = this.userSockets.get(userId);
                if (set) {
                    set.delete(client.id);
                    if (set.size === 0)
                        this.userSockets.delete(userId);
                }
            }
            this.logger.log(`Socket disconnected: ${client.id}`);
        }
        catch (err) {
            this.logger.error('Error on disconnect', err);
        }
    }
    sendToUser(userId, event, payload) {
        try {
            this.server.to(`user:${userId}`).emit(event, payload);
        }
        catch (err) {
            this.logger.error('sendToUser error', err);
        }
    }
    sendToRole(role, event, payload) {
        try {
            this.server.to(`role:${role}`).emit(event, payload);
        }
        catch (err) {
            this.logger.error('sendToRole error', err);
        }
    }
    async sendRoleChangedNotification(userId, newRole) {
        this.server.emit('userRoleChanged', { userId, newRole });
    }
    async sendBlockStatusNotification(userId, blocked) {
        this.server.emit('userBlockStatusChanged', { userId, blocked });
    }
    broadcast(event, payload) {
        try {
            this.server.emit(event, payload);
        }
        catch (err) {
            this.logger.error('broadcast error', err);
        }
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [config_1.ConfigService, mongoose_2.Model])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map