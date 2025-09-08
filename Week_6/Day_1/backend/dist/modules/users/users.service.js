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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const bcrypt = require("bcrypt");
const notifications_service_1 = require("../notifications/notifications.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let UsersService = class UsersService {
    constructor(userModel, notifications, notificationsGateway) {
        this.userModel = userModel;
        this.notifications = notifications;
        this.notificationsGateway = notificationsGateway;
    }
    async findById(id) {
        const user = await this.userModel
            .findById(id)
            .select('-password -refreshTokenHash -blocked -isEmailVerified');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.newPassword) {
            if (!dto.oldPassword) {
                throw new common_1.BadRequestException('Old password is required to set a new password');
            }
            const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
            if (!isMatch) {
                throw new common_1.BadRequestException('Old password is incorrect');
            }
            if (dto.newPassword.length < 6) {
                throw new common_1.BadRequestException('New password must be at least 6 characters long');
            }
            user.password = dto.newPassword;
        }
        if (dto.name)
            user.name = dto.name;
        if (dto.addresses)
            user.addresses = dto.addresses;
        await user.save();
        try {
            await this.notifications.sendProfileUpdatedNotification(userId);
        }
        catch (e) {
            console.error('Failed to send profile updated notification', e);
        }
        return await this.userModel
            .findById(userId)
            .select('-password -refreshTokenHash -blocked -isEmailVerified');
    }
    async findAll() {
        return this.userModel.find().select('-password -refreshTokenHash');
    }
    async findByIdRaw(id) {
        return this.userModel.findById(id);
    }
    async updateRole(id, role) {
        const user = await this.userModel.findByIdAndUpdate(id, { role }, { new: true });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        await this.notificationsGateway.sendRoleChangedNotification(id, role);
        return user;
    }
    async toggleBlock(id, block) {
        const user = await this.userModel.findByIdAndUpdate(id, { blocked: block }, { new: true });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        await this.notificationsGateway.sendBlockStatusNotification(id, block);
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway])
], UsersService);
//# sourceMappingURL=users.service.js.map