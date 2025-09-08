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
exports.CreateProductDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const product_schema_1 = require("../../../schemas/product.schema");
const swagger_1 = require("@nestjs/swagger");
class SizeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: product_schema_1.Size.M }),
    (0, class_validator_1.IsEnum)(product_schema_1.Size),
    __metadata("design:type", String)
], SizeDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SizeDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SKU123-M' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SizeDto.prototype, "sku", void 0);
class VariantDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: product_schema_1.Color.BLACK }),
    (0, class_validator_1.IsEnum)(product_schema_1.Color),
    __metadata("design:type", String)
], VariantDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            'https://example.com/images/product-black-1.jpg',
            'https://example.com/images/product-black-2.jpg',
            'https://example.com/images/product-black-3.jpg',
        ],
        description: 'Must include exactly 3 images',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(3, { message: 'Each variant must include exactly 3 images' }),
    __metadata("design:type", Array)
], VariantDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [SizeDto],
        example: [
            { size: product_schema_1.Size.S, stock: 10, sku: 'TSHIRT-BLK-S' },
            { size: product_schema_1.Size.M, stock: 15, sku: 'TSHIRT-BLK-M' },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SizeDto),
    __metadata("design:type", Array)
], VariantDto.prototype, "sizes", void 0);
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Classic Black T-Shirt' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A premium cotton black t-shirt for everyday wear.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.Category, example: product_schema_1.Category.TSHIRTS }),
    (0, class_validator_1.IsEnum)(product_schema_1.Category),
    __metadata("design:type", String)
], CreateProductDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.Style, example: product_schema_1.Style.CASUAL }),
    (0, class_validator_1.IsEnum)(product_schema_1.Style),
    __metadata("design:type", String)
], CreateProductDto.prototype, "style", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nike' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2499, description: 'Price in PKR' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "regularPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: product_schema_1.PaymentType, example: product_schema_1.PaymentType.MONEY }),
    (0, class_validator_1.IsEnum)(product_schema_1.PaymentType),
    __metadata("design:type", String)
], CreateProductDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Discount percent for first purchase' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "discountPercent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [VariantDto],
        example: [
            {
                color: product_schema_1.Color.BLACK,
                images: [
                    'https://example.com/images/black1.jpg',
                    'https://example.com/images/black2.jpg',
                    'https://example.com/images/black3.jpg',
                ],
                sizes: [
                    { size: product_schema_1.Size.S, stock: 10, sku: 'TSHIRT-BLK-S' },
                    { size: product_schema_1.Size.M, stock: 15, sku: 'TSHIRT-BLK-M' },
                ],
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VariantDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
//# sourceMappingURL=create-product.dto.js.map