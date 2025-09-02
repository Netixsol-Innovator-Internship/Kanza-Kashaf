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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../schemas/user.schema");
const mailer_service_1 = require("../mailer/mailer.service");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    constructor(userModel, jwtService, mailer) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.mailer = mailer;
    }
    async register(dto) {
        const exists = await this.userModel.findOne({ $or: [{ email: dto.email }, { username: dto.username }] });
        if (exists)
            throw new common_1.BadRequestException('Email or username already exists');
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({
            username: dto.username,
            email: dto.email,
            password: hash,
            fullName: dto.fullName,
            phone: dto.phone
        });
        const token = (0, uuid_1.v4)();
        await this.mailer.sendMockEmail(dto.email, 'Verify your account', `Use this token to verify: ${token}`);
        const payload = { sub: user._id.toString(), email: user.email, username: user.username };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        });
        return { accessToken, user };
    }
    async login(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const payload = { sub: user._id.toString(), email: user.email, username: user.username };
        const expiresIn = dto.rememberMe ? '7d' : (process.env.JWT_EXPIRES_IN || '1d');
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn
        });
        return { accessToken, user };
    }
    async forgotPassword(email) {
        const user = await this.userModel.findOne({ email });
        if (!user)
            return { success: true };
        const token = (0, uuid_1.v4)();
        await this.mailer.sendMockEmail(email, 'Reset Password', `Use this token to reset: ${token}`);
        return { success: true };
    }
    async resetPassword(token, newPassword) {
        const hash = await bcrypt.hash(newPassword, 10);
        return { success: true, note: 'Mock reset; implement token-store if needed' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map