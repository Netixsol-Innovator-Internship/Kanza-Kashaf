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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./comment.schema");
let CommentsService = class CommentsService {
    constructor(model) {
        this.model = model;
    }
    async list(postId) {
        return this.model.find({ postId }).sort({ createdAt: 1 }).lean();
    }
    async create(data) {
        const doc = new this.model({
            postId: data.postId,
            userId: new mongoose_2.Types.ObjectId(data.userId),
            userName: data.userName,
            text: data.text,
            parentId: data.parentId ? new mongoose_2.Types.ObjectId(data.parentId) : null,
            createdAt: new Date(),
        });
        await doc.save();
        return doc.toObject();
    }
    async update(id, userId, text) {
        const doc = await this.model.findById(id);
        if (!doc)
            throw new common_1.NotFoundException('Not found');
        if (doc.userId.toString() !== userId)
            throw new common_1.NotFoundException('Not found');
        doc.text = text;
        await doc.save();
        return doc.toObject();
    }
    async remove(id, userId) {
        const doc = await this.model.findById(id);
        if (!doc)
            throw new common_1.NotFoundException('Not found');
        if (doc.userId.toString() !== userId)
            throw new common_1.NotFoundException('Not found');
        await doc.deleteOne();
        return { ok: true };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentsService);
//# sourceMappingURL=comments.service.js.map