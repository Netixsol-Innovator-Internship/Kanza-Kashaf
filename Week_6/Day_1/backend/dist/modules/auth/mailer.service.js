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
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let MailerService = class MailerService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger('MailerService');
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.config.get('GMAIL_USER'),
                pass: this.config.get('GMAIL_PASS'),
            },
        });
    }
    async sendOtpEmail(to, otp, type) {
        const subject = type === 'verification' ? 'Your verification OTP' : 'Your password reset OTP';
        const html = `<p>Your ${subject}: <strong>${otp}</strong></p><p>It expires in 5 minutes.</p>`;
        await this.transporter.sendMail({
            from: this.config.get('GMAIL_USER'),
            to,
            subject,
            html,
        });
        this.logger.log(`OTP email sent to ${to}`);
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map