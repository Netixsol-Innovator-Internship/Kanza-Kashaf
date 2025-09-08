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
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class AddressDto {
}
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
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Updated Name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'mypassword123', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "oldPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'myNewPassword456', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "newPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        type: [AddressDto],
        example: [
            {
                addressLine1: 'Street 12',
                city: 'Lahore',
                province: 'Punjab',
                country: 'PK',
                postalCode: '54000',
            },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AddressDto),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "addresses", void 0);
//# sourceMappingURL=update-user.dto.js.map