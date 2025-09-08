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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
const user_schema_1 = require("../../schemas/user.schema");
const notification_schema_1 = require("../../schemas/notification.schema");
let NotificationsController = class NotificationsController {
    constructor(notifications) {
        this.notifications = notifications;
    }
    async getAllNotifications() {
        return this.notifications.findAll();
    }
    async getSuperAdminNotifs() {
        return this.notifications.findSuperAdminNotifications();
    }
    async getUserNotifications(userId, req) {
        const currentUser = req.user;
        if (currentUser.role !== user_schema_1.Role.SUPER_ADMIN && currentUser.userId !== userId) {
            throw new common_1.ForbiddenException('You can only access your own notifications');
        }
        return this.notifications.findUserAndRoleNotifications(userId, currentUser.role);
    }
    async markAsRead(id, req) {
        const notif = await this.notifications.markAsRead(id);
        const currentUser = req.user;
        if (notif.targetRole === user_schema_1.Role.SUPER_ADMIN && currentUser.role !== user_schema_1.Role.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only super admins can read this notification');
        }
        if (notif.user &&
            currentUser.role !== user_schema_1.Role.SUPER_ADMIN &&
            notif.user.toString() !== currentUser.userId) {
            throw new common_1.ForbiddenException('You can only read your own notifications');
        }
        return notif;
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOkResponse)({ type: [notification_schema_1.Notification] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getAllNotifications", null);
__decorate([
    (0, common_1.Get)('super-admin'),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOkResponse)({ type: [notification_schema_1.Notification] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getSuperAdminNotifs", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOkResponse)({ type: [notification_schema_1.Notification] }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Not allowed to view other users notifications' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOkResponse)({ type: notification_schema_1.Notification }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map