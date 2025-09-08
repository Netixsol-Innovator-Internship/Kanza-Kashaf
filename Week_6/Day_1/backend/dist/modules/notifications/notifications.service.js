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
const notifications_gateway_1 = require("./notifications.gateway");
const notification_schema_1 = require("../../schemas/notification.schema");
const user_schema_1 = require("../../schemas/user.schema");
let NotificationsService = class NotificationsService {
    constructor(notifModel, userModel, gateway) {
        this.notifModel = notifModel;
        this.userModel = userModel;
        this.gateway = gateway;
        this.logger = new common_1.Logger('NotificationsService');
    }
    async createAndEmit(type, message, userId, targetRole) {
        let resolvedTargetRole = targetRole;
        if (!resolvedTargetRole && userId) {
            try {
                const user = await this.userModel.findById(typeof userId === 'string' ? new mongoose_2.Types.ObjectId(userId) : userId);
                if (user)
                    resolvedTargetRole = user.role;
            }
            catch {
                this.logger.warn(`Could not resolve role for notification: ${type}`);
            }
        }
        const doc = await this.notifModel.create({
            type,
            message,
            user: userId
                ? typeof userId === 'string'
                    ? new mongoose_2.Types.ObjectId(userId)
                    : userId
                : null,
            targetRole: resolvedTargetRole,
            read: false,
        });
        const payload = doc.toObject();
        try {
            if (userId) {
                const idStr = typeof userId === 'string' ? userId : userId.toString();
                this.gateway.sendToUser(idStr, 'notification', payload);
            }
            else if (targetRole) {
                this.gateway.sendToRole(targetRole, 'notification', payload);
            }
            else {
                this.gateway.broadcast('notification', payload);
            }
        }
        catch (err) {
            this.logger.error('Emit failed', err);
        }
        return doc;
    }
    async emitEvent(eventName, payload) {
        try {
            this.gateway.broadcast(eventName, payload);
        }
        catch (e) {
            this.logger.error('emitEvent failed', e);
        }
    }
    async sendOtpNotification(userId) {
        return this.createAndEmit('OTP_SENT', 'OTP sent successfully!', userId);
    }
    async sendUserNotification(userId, type, message) {
        return this.createAndEmit(type, message, new mongoose_2.Types.ObjectId(userId));
    }
    async sendProfileUpdatedNotification(userId) {
        const notif = await this.createAndEmit('PROFILE_UPDATED', 'Your profile has been updated', userId);
        this.emitEvent('PROFILE_UPDATED', { userId });
        return notif;
    }
    async sendNewArrivalNotification(productId, productName) {
        const notif = await this.createAndEmit('NEW_ARRIVAL', `New arrival: ${productName}`, undefined, user_schema_1.Role.USER);
        await this.createAndEmit('NEW_ARRIVAL', `New arrival: ${productName}`, undefined, user_schema_1.Role.ADMIN);
        await this.createAndEmit('NEW_ARRIVAL', `New arrival: ${productName}`, undefined, user_schema_1.Role.SUPER_ADMIN);
        this.emitEvent('NEW_ARRIVAL', { productName });
        return notif;
    }
    async sendSaleStartNotificationForProduct(productId, productName, percent) {
        await this.createAndEmit('SALE_STARTED', `Sale started for ${productName}: ${percent}% off`, undefined, user_schema_1.Role.USER);
        await this.createAndEmit('SALE_STARTED', `Sale started for ${productName}: ${percent}% off`, undefined, user_schema_1.Role.ADMIN);
        await this.createAndEmit('SALE_STARTED', `Sale started for ${productName}: ${percent}% off`, undefined, user_schema_1.Role.SUPER_ADMIN);
        this.emitEvent('SALE_STARTED', { productId, productName, percent });
        return { ok: true };
    }
    async sendSaleEndNotificationForProduct(productId, productName) {
        await this.createAndEmit('SALE_ENDED', `Sale ended for ${productName}`, undefined, user_schema_1.Role.USER);
        await this.createAndEmit('SALE_ENDED', `Sale ended for ${productName}`, undefined, user_schema_1.Role.ADMIN);
        await this.createAndEmit('SALE_ENDED', `Sale ended for ${productName}`, undefined, user_schema_1.Role.SUPER_ADMIN);
        this.emitEvent('SALE_ENDED', { productId, productName });
        return { ok: true };
    }
    async sendSaleStartGlobal(campaignName, percent) {
        const msg = `Sale started: ${campaignName} - ${percent}% off`;
        await this.createAndEmit('SALE_STARTED', msg, undefined, user_schema_1.Role.USER);
        await this.createAndEmit('SALE_STARTED', msg, undefined, user_schema_1.Role.ADMIN);
        await this.createAndEmit('SALE_STARTED', msg, undefined, user_schema_1.Role.SUPER_ADMIN);
        this.emitEvent('SALE_STARTED_GLOBAL', { campaignName, percent });
        return { ok: true };
    }
    async sendSaleEndGlobal(campaignName) {
        const msg = `Sale ended: ${campaignName}`;
        await this.createAndEmit('SALE_ENDED', msg, undefined, user_schema_1.Role.USER);
        await this.createAndEmit('SALE_ENDED', msg, undefined, user_schema_1.Role.ADMIN);
        await this.createAndEmit('SALE_ENDED', msg, undefined, user_schema_1.Role.SUPER_ADMIN);
        this.emitEvent('SALE_ENDED_GLOBAL', { campaignName });
        return { ok: true };
    }
    async sendProductSoldOutNotification(productId, productName, variant, size) {
        const variantInfo = variant ? ` variant:${variant}` : '';
        const sizeInfo = size ? ` size:${size}` : '';
        const msg = `Product sold out: ${productName}${variantInfo}${sizeInfo}`;
        await this.createAndEmit('PRODUCT_SOLD_OUT', msg, undefined, user_schema_1.Role.ADMIN);
        await this.createAndEmit('PRODUCT_SOLD_OUT', msg, undefined, user_schema_1.Role.SUPER_ADMIN);
        this.emitEvent('PRODUCT_SOLD_OUT', { productId, productName, variant, size });
    }
    async sendOutOfStockNotification(userId, productName, variant, size) {
        const variantInfo = variant ? ` variant:${variant}` : '';
        const sizeInfo = size ? ` size:${size}` : '';
        const msg = `Product is out of stock: ${productName}${variantInfo}${sizeInfo}`;
        const notif = await this.createAndEmit('OUT_OF_STOCK', msg, new mongoose_2.Types.ObjectId(userId));
        this.emitEvent('OUT_OF_STOCK', { productName, variant, size, userId });
        return notif;
    }
    async sendPaymentAcceptedNotification(userId, orderId) {
        const msg = orderId ? `Payment accepted for order ${orderId}` : 'Payment accepted';
        const notif = await this.createAndEmit('PAYMENT_ACCEPTED', msg, new mongoose_2.Types.ObjectId(userId));
        this.emitEvent('PAYMENT_ACCEPTED', { userId, orderId });
        return notif;
    }
    async sendRoleChangeNotification(userId, newRole) {
        const notif = await this.createAndEmit('ROLE_CHANGE', `Your role changed to ${newRole}`, userId, newRole);
        this.emitEvent('ROLE_CHANGE', { userId, newRole });
        return notif;
    }
    async sendBlockedNotification(userId) {
        const notif = await this.createAndEmit('BLOCKED', 'Your account has been blocked by an admin.', userId, user_schema_1.Role.USER);
        this.emitEvent('BLOCKED', { userId });
        return notif;
    }
    async findAll() {
        return this.notifModel.find().populate('user').sort({ createdAt: -1 });
    }
    async findUserNotifications(userId) {
        return this.notifModel.find({ user: userId }).sort({ createdAt: -1 });
    }
    async findSuperAdminNotifications() {
        return this.notifModel.find({ targetRole: user_schema_1.Role.SUPER_ADMIN }).sort({ createdAt: -1 });
    }
    async markAsRead(id) {
        return this.notifModel.findByIdAndUpdate(id, { read: true }, { new: true });
    }
    async findUserAndRoleNotifications(userId, role) {
        return this.notifModel.find({
            $or: [{ user: userId }, { targetRole: role }],
        }).sort({ createdAt: -1 });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map