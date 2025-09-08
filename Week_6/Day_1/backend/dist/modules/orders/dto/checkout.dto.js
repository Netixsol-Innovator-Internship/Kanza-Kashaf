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
exports.CheckoutDto = exports.HybridSelectionDto = exports.OrderPaymentMethod = exports.AddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AddressDto {
}
exports.AddressDto = AddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Street 12' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "addressLine1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lahore' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Punjab' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PK' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '54000' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddressDto.prototype, "postalCode", void 0);
var OrderPaymentMethod;
(function (OrderPaymentMethod) {
    OrderPaymentMethod["MONEY"] = "money";
    OrderPaymentMethod["POINTS"] = "points";
    OrderPaymentMethod["HYBRID"] = "hybrid";
})(OrderPaymentMethod || (exports.OrderPaymentMethod = OrderPaymentMethod = {}));
class HybridSelectionDto {
}
exports.HybridSelectionDto = HybridSelectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64f9a2b...' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HybridSelectionDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['money', 'points'], example: 'money' }),
    (0, class_validator_1.IsEnum)(['money', 'points']),
    __metadata("design:type", String)
], HybridSelectionDto.prototype, "method", void 0);
class CheckoutDto {
}
exports.CheckoutDto = CheckoutDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: AddressDto }),
    __metadata("design:type", AddressDto)
], CheckoutDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderPaymentMethod, example: OrderPaymentMethod.MONEY }),
    (0, class_validator_1.IsEnum)(OrderPaymentMethod),
    __metadata("design:type", String)
], CheckoutDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Use existing cart id. If omitted, active cart is used.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "cartId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'When paymentMethod=hybrid, provide selections', type: [HybridSelectionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => HybridSelectionDto),
    __metadata("design:type", Array)
], CheckoutDto.prototype, "hybridSelections", void 0);
//# sourceMappingURL=checkout.dto.js.map