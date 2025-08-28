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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const comments_service_1 = require("./comments.service");
const dto_1 = require("./dto");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const comments_gateway_1 = require("./comments.gateway");
let CommentsController = class CommentsController {
    constructor(svc, gateway) {
        this.svc = svc;
        this.gateway = gateway;
    }
    list(postId) {
        return this.svc.list(postId);
    }
    async create(dto, user) {
        var _a;
        const comment = await this.svc.create({
            postId: dto.postId,
            text: dto.text,
            userId: user.userId,
            userName: user.username,
            parentId: (_a = dto.parentId) !== null && _a !== void 0 ? _a : null,
        });
        this.gateway.emitToOthers('comment:new', comment, user.userId);
        return comment;
    }
    async update(id, dto, user) {
        const updated = await this.svc.update(id, user.userId, dto.text);
        this.gateway.emitToActor('comment:update', updated, user.userId);
        return updated;
    }
    async remove(id, user) {
        await this.svc.remove(id, user.userId);
        this.gateway.emitToActor('comment:delete', { id }, user.userId);
        return { ok: true };
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "remove", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService, comments_gateway_1.CommentsGateway])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map