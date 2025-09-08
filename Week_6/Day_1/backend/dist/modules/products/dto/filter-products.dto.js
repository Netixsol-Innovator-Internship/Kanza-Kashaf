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
exports.FilterProductsDto = void 0;
const class_validator_1 = require("class-validator");
const product_schema_1 = require("../../../schemas/product.schema");
const swagger_1 = require("@nestjs/swagger");
class FilterProductsDto {
}
exports.FilterProductsDto = FilterProductsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.Category, example: product_schema_1.Category.TSHIRTS, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(product_schema_1.Category),
    __metadata("design:type", String)
], FilterProductsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterProductsDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterProductsDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.Color, example: [product_schema_1.Color.BLACK, product_schema_1.Color.WHITE], required: false, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], FilterProductsDto.prototype, "colors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.Size, example: [product_schema_1.Size.S, product_schema_1.Size.M], required: false, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], FilterProductsDto.prototype, "sizes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.Style, example: [product_schema_1.Style.CASUAL], required: false, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], FilterProductsDto.prototype, "styles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterProductsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FilterProductsDto.prototype, "limit", void 0);
//# sourceMappingURL=filter-products.dto.js.map