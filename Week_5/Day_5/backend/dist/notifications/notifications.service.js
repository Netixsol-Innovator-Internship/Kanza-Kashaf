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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("../schemas/notification.schema");
const user_schema_1 = require("../schemas/user.schema");
const ws_gateway_1 = require("../ws/ws.gateway");
let NotificationsService = class NotificationsService {
    constructor(notificationModel, userModel, ws) {
        this.notificationModel = notificationModel;
        this.userModel = userModel;
        this.ws = ws;
    }
    async create(userId, type, data) {
        const uid = typeof userId === 'string' ? new mongoose_2.Types.ObjectId(userId) : userId;
        const doc = await this.notificationModel.create({ userId: uid, type, data });
        this.ws.emitToUser(uid.toString(), 'notification:new', this.serialize(doc));
        return doc;
    }
    async createForUsers(userIds, type, data) {
        const unique = Array.from(new Set(userIds.map((id) => id.toString())));
        if (!unique.length)
            return [];
        const docs = await this.notificationModel.insertMany(unique.map((id) => ({ userId: new mongoose_2.Types.ObjectId(id), type, data })), { ordered: false });
        for (const d of docs) {
            this.ws.emitToUser(d.userId.toString(), 'notification:new', this.serialize(d));
        }
        return docs;
    }
    async createForAll(type, data) {
        const users = await this.userModel.find({}, { _id: 1 }).lean();
        if (!users.length)
            return [];
        const docs = await this.notificationModel.insertMany(users.map((u) => ({ userId: u._id, type, data })), { ordered: false });
        for (const d of docs) {
            this.ws.emitToUser(d.userId.toString(), 'notification:new', this.serialize(d));
        }
        return docs;
    }
    async list(userId) {
        return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
    }
    async unreadCount(userId) {
        return this.notificationModel.countDocuments({ userId, read: false });
    }
    async markRead(id, userId) {
        const q = { _id: id };
        if (userId)
            q.userId = userId;
        const updated = await this.notificationModel.findOneAndUpdate(q, { read: true }, { new: true });
        if (updated) {
            this.ws.emitToUser(updated.userId.toString(), 'notification:updated', this.serialize(updated));
        }
        return updated;
    }
    async markAllRead(userId) {
        await this.notificationModel.updateMany({ userId, read: false }, { read: true });
        this.ws.emitToUser(userId, 'notification:mark_all_read', { userId });
        return { ok: true };
    }
    serialize(n) {
        return {
            _id: n._id.toString(),
            userId: n.userId.toString(),
            type: n.type,
            data: n.data,
            read: n.read,
            createdAt: n.createdAt,
            updatedAt: n.updatedAt,
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        ws_gateway_1.WsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map