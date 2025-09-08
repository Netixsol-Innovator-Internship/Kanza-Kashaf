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
exports.ProductSchema = exports.Product = exports.ProductVariantSchema = exports.ProductVariant = exports.VariantSizeSchema = exports.VariantSize = exports.PaymentType = exports.Style = exports.Size = exports.Color = exports.Category = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var Category;
(function (Category) {
    Category["TSHIRTS"] = "t-shirts";
    Category["SHORTS"] = "shorts";
    Category["SHIRTS"] = "shirts";
    Category["HOODIE"] = "hoodie";
    Category["JEANS"] = "jeans";
})(Category || (exports.Category = Category = {}));
var Color;
(function (Color) {
    Color["GREEN"] = "green";
    Color["RED"] = "red";
    Color["YELLOW"] = "yellow";
    Color["ORANGE"] = "orange";
    Color["BLUE"] = "blue";
    Color["NAVY"] = "navy";
    Color["PURPLE"] = "purple";
    Color["PINK"] = "pink";
    Color["WHITE"] = "white";
    Color["BLACK"] = "black";
})(Color || (exports.Color = Color = {}));
var Size;
(function (Size) {
    Size["XXS"] = "xx-small";
    Size["XS"] = "x-small";
    Size["S"] = "small";
    Size["M"] = "medium";
    Size["L"] = "large";
    Size["XL"] = "x-large";
    Size["XXL"] = "xx-large";
    Size["XXXL"] = "3x-large";
    Size["XXXXL"] = "4x-large";
})(Size || (exports.Size = Size = {}));
var Style;
(function (Style) {
    Style["CASUAL"] = "casual";
    Style["FORMAL"] = "formal";
    Style["PARTY"] = "party";
    Style["GYM"] = "gym";
})(Style || (exports.Style = Style = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["MONEY"] = "money";
    PaymentType["POINTS"] = "points";
    PaymentType["HYBRID"] = "hybrid";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
let VariantSize = class VariantSize {
};
exports.VariantSize = VariantSize;
__decorate([
    (0, mongoose_1.Prop)({ enum: Size, required: true }),
    __metadata("design:type", String)
], VariantSize.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], VariantSize.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], VariantSize.prototype, "sku", void 0);
exports.VariantSize = VariantSize = __decorate([
    (0, mongoose_1.Schema)()
], VariantSize);
exports.VariantSizeSchema = mongoose_1.SchemaFactory.createForClass(VariantSize);
let ProductVariant = class ProductVariant {
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, mongoose_1.Prop)({ enum: Color, required: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.VariantSizeSchema], default: [] }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "sizes", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, mongoose_1.Schema)()
], ProductVariant);
exports.ProductVariantSchema = mongoose_1.SchemaFactory.createForClass(ProductVariant);
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Category, required: true }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Style, required: false }),
    __metadata("design:type", String)
], Product.prototype, "style", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Product.prototype, "brand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "regularPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PaymentType, default: PaymentType.MONEY }),
    __metadata("design:type", String)
], Product.prototype, "paymentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "discountPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "salePercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], Product.prototype, "saleStartAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], Product.prototype, "saleEndAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "pointsPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "ratingAvg", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "ratingCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.ProductVariantSchema], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "active", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "salesCount", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
//# sourceMappingURL=product.schema.js.map