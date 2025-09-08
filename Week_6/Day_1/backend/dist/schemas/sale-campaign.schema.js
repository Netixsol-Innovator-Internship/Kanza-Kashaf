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
exports.SaleCampaignSchema = exports.SaleCampaign = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
let SaleCampaign = class SaleCampaign {
};
exports.SaleCampaign = SaleCampaign;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SaleCampaign.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SaleCampaign.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SaleCampaign.prototype, "percent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'Product', default: [] }),
    __metadata("design:type", Array)
], SaleCampaign.prototype, "productIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: product_schema_1.Category, default: [] }),
    __metadata("design:type", Array)
], SaleCampaign.prototype, "categories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], SaleCampaign.prototype, "startAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], SaleCampaign.prototype, "endAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], SaleCampaign.prototype, "startNotified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], SaleCampaign.prototype, "endNotified", void 0);
exports.SaleCampaign = SaleCampaign = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SaleCampaign);
exports.SaleCampaignSchema = mongoose_1.SchemaFactory.createForClass(SaleCampaign);
//# sourceMappingURL=sale-campaign.schema.js.map