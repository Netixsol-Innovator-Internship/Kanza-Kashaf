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
const notifications_service_1 = require("../notifications/notifications.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/user.schema");
const otp_schema_1 = require("../../schemas/otp.schema");
const crypto = require("crypto");
const mailer_service_1 = require("./mailer.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(userModel, otpModel, mailer, jwt, config, notifications) {
        this.userModel = userModel;
        this.otpModel = otpModel;
        this.mailer = mailer;
        this.jwt = jwt;
        this.config = config;
        this.notifications = notifications;
    }
    genOtpCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    hashCode(code) {
        return crypto.createHash('sha256').update(code).digest('hex');
    }
    async register(name, email, password) {
        email = email.toLowerCase();
        const existing = await this.userModel.findOne({ email });
        if (existing)
            throw new common_1.BadRequestException('Email already registered');
        const user = new this.userModel({ name, email, password });
        await user.save();
        await this.createAndSendOtp(user._id, email, 'verification');
        return { userId: user._id, message: 'OTP sent to email' };
    }
    async createAndSendOtp(userId, email, type) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const count = await this.otpModel.countDocuments({ user: userId, createdAt: { $gte: oneDayAgo } });
        if (count >= 5)
            throw new common_1.ForbiddenException('OTP resend limit reached for today');
        const last = await this.otpModel.findOne({ user: userId }).sort({ createdAt: -1 });
        if (last && (Date.now() - last.createdAt.getTime()) < 60000)
            throw new common_1.ForbiddenException('Please wait before requesting a new OTP');
        const code = this.genOtpCode();
        const codeHash = this.hashCode(code);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.otpModel.create({ user: userId, codeHash, type, expiresAt, attempts: 0 });
        await this.mailer.sendOtpEmail(email, code, type);
        await this.notifications.sendOtpNotification(userId);
        return true;
    }
    async verifyOtp(email, code, type) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const otpDoc = await this.otpModel.findOne({ user: user._id, type }).sort({ createdAt: -1 });
        if (!otpDoc)
            throw new common_1.BadRequestException('No OTP found. Request a new one.');
        if (otpDoc.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('OTP expired. Request a new one.');
        }
        if (otpDoc.attempts >= 5)
            throw new common_1.BadRequestException('OTP attempts exceeded');
        const codeHash = this.hashCode(code);
        if (codeHash !== otpDoc.codeHash) {
            otpDoc.attempts += 1;
            await otpDoc.save();
            throw new common_1.BadRequestException('Invalid OTP');
        }
        await this.otpModel.deleteMany({ user: user._id, type });
        if (type === 'verification') {
            user.isEmailVerified = true;
            await user.save();
            return { verified: true };
        }
        return { ok: true };
    }
    async login(email, password) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() });
        if (!user)
            throw new common_1.NotFoundException('Invalid credentials');
        if (user.blocked)
            throw new common_1.ForbiddenException('User is blocked');
        if (!user.isEmailVerified)
            throw new common_1.ForbiddenException('Email not verified');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            throw new common_1.BadRequestException('Invalid credentials');
        return this.createTokenPair(user);
    }
    async createTokenPair(user) {
        const payload = { sub: user._id.toString(), role: user.role, email: user.email };
        const access = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET') || 'changeme_super_secret',
            expiresIn: this.config.get('JWT_ACCESS_EXPIRES') || '15m',
        });
        const refresh = await this.jwt.signAsync({ sub: user._id.toString() }, {
            secret: this.config.get('JWT_REFRESH_SECRET') || 'changeme_refresh_secret',
            expiresIn: this.config.get('JWT_REFRESH_EXPIRES') || '7d',
        });
        const refreshHash = crypto.createHash('sha256').update(refresh).digest('hex');
        user.refreshTokenHash = refreshHash;
        await user.save();
        return { accessToken: access, refreshToken: refresh };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') || 'changeme_refresh_secret' });
            const user = await this.userModel.findById(payload.sub);
            if (!user)
                throw new common_1.ForbiddenException();
            const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            if (user.refreshTokenHash !== hash)
                throw new common_1.ForbiddenException();
            return this.createTokenPair(user);
        }
        catch (err) {
            throw new common_1.ForbiddenException('Invalid refresh token');
        }
    }
    async logout(refreshToken) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') || 'changeme_refresh_secret' });
            const user = await this.userModel.findById(payload.sub);
            if (!user)
                return;
            user.refreshTokenHash = null;
            await user.save();
        }
        catch (err) {
        }
    }
    async requestPasswordReset(email) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.createAndSendOtp(user._id, user.email, 'password_reset');
        return { ok: true };
    }
    async resetPassword(email, code, newPassword) {
        await this.verifyOtp(email, code, 'password_reset');
        const user = await this.userModel.findOne({ email: email.toLowerCase() });
        user.password = newPassword;
        await user.save();
        user.refreshTokenHash = null;
        await user.save();
        return { ok: true };
    }
    async resendOtp(email) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.createAndSendOtp(user._id, user.email, 'verification');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mailer_service_1.MailerService,
        jwt_1.JwtService,
        config_1.ConfigService,
        notifications_service_1.NotificationsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map