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
exports.UserSchema = exports.User = exports.Role = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
    Role["SUPER_ADMIN"] = "super_admin";
})(Role || (exports.Role = Role = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "loyaltyPoints", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Role.USER, enum: Role }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Cart' }], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "cart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Order' }], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "blocked", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                addressLine1: String,
                city: String,
                province: String,
                country: String,
                postalCode: String,
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "addresses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], User.prototype, "refreshTokenHash", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
exports.UserSchema.post('save', async function (doc) {
    try {
        if (this.isModified && this.isModified('role')) {
            await this.model('Notification').updateMany({ user: doc._id }, { $set: { targetRole: doc.role } });
        }
    }
    catch (e) {
    }
});
exports.UserSchema.post('findOneAndUpdate', async function (doc) {
    try {
        if (!doc)
            return;
        const update = this.getUpdate?.() || {};
        const newRole = update.role || update.$set?.role;
        if (!newRole)
            return;
        await this.model('Notification').updateMany({ user: doc._id }, { $set: { targetRole: newRole } });
    }
    catch (e) {
    }
});
exports.UserSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};
//# sourceMappingURL=user.schema.js.map