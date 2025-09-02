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
exports.CreateAuctionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAuctionDto {
}
exports.CreateAuctionDto = CreateAuctionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "vin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAuctionDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "make", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "carModel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAuctionDto.prototype, "mileage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['4 Cylinder', '6 Cylinder', '8 Cylinder', '10 Cylinder', '12 Cylinder'] }),
    (0, class_validator_1.IsEnum)(['4 Cylinder', '6 Cylinder', '8 Cylinder', '10 Cylinder', '12 Cylinder']),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "engineSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Original paint', 'Partially Repainted', 'Totally Repainted'] }),
    (0, class_validator_1.IsEnum)(['Original paint', 'Partially Repainted', 'Totally Repainted']),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "paint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Yes', 'No'] }),
    (0, class_validator_1.IsEnum)(['Yes', 'No']),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "hasGccSpecs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Yes', 'No'] }),
    (0, class_validator_1.IsEnum)(['Yes', 'No']),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "accidentHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Yes', 'No'] }),
    (0, class_validator_1.IsEnum)(['Yes', 'No']),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "serviceHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Completely stock', 'Modified'] }),
    (0, class_validator_1.IsEnum)(['Completely stock', 'Modified']),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "modificationStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAuctionDto.prototype, "minBid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], minItems: 6, maxItems: 6 }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(6),
    (0, class_validator_1.ArrayMaxSize)(6),
    __metadata("design:type", Array)
], CreateAuctionDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAuctionDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreateAuctionDto.prototype, "minIncrement", void 0);
//# sourceMappingURL=create-auction.dto.js.map