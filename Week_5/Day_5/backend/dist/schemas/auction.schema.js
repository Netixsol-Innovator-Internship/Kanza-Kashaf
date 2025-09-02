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
exports.AuctionSchema = exports.Auction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Auction = class Auction extends mongoose_2.Document {
};
exports.Auction = Auction;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Auction.prototype, "vin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Auction.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Auction.prototype, "make", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Auction.prototype, "carModel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Auction.prototype, "mileage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['4 Cylinder', '6 Cylinder', '8 Cylinder', '10 Cylinder', '12 Cylinder'] }),
    __metadata("design:type", String)
], Auction.prototype, "engineSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Original paint', 'Partially Repainted', 'Totally Repainted'] }),
    __metadata("design:type", String)
], Auction.prototype, "paint", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Yes', 'No'] }),
    __metadata("design:type", String)
], Auction.prototype, "hasGccSpecs", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Auction.prototype, "features", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Yes', 'No'] }),
    __metadata("design:type", String)
], Auction.prototype, "accidentHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Yes', 'No'] }),
    __metadata("design:type", String)
], Auction.prototype, "serviceHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Completely stock', 'Modified'] }),
    __metadata("design:type", String)
], Auction.prototype, "modificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Auction.prototype, "minBid", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        validate: [(val) => val.length === 6, 'Exactly 6 images required'],
    }),
    __metadata("design:type", Array)
], Auction.prototype, "photos", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Auction.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Auction.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Auction.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'live', enum: ['live', 'ended', 'paid'] }),
    __metadata("design:type", String)
], Auction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 100 }),
    __metadata("design:type", Number)
], Auction.prototype, "minIncrement", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Auction.prototype, "currentPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Auction.prototype, "winnerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            bidderName: String,
            bidderEmail: String,
            bidderPhone: String,
            bidderNationality: String,
            bidderIdType: String,
            bidderAvatar: String,
            bid: Number,
        },
        default: null,
    }),
    __metadata("design:type", Object)
], Auction.prototype, "highest", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'User', default: [] }),
    __metadata("design:type", Array)
], Auction.prototype, "biddersList", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Auction.prototype, "totalBids", void 0);
exports.Auction = Auction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Auction);
exports.AuctionSchema = mongoose_1.SchemaFactory.createForClass(Auction);
//# sourceMappingURL=auction.schema.js.map