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
exports.NotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class NotificationDto {
}
exports.NotificationDto = NotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64f9a8d7c9e4a4a12b3d4567', description: 'User ID' }),
    __metadata("design:type", String)
], NotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'auction_started',
        enum: [
            'auction_started',
            'new_bid',
            'auction_won',
            'auction_ended',
            'wishlist_updated',
            'auction_created',
        ],
    }),
    __metadata("design:type", String)
], NotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { auctionId: '64f9...', message: '...' } }),
    __metadata("design:type", Object)
], NotificationDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], NotificationDto.prototype, "read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-29T12:34:56.789Z' }),
    __metadata("design:type", Date)
], NotificationDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-29T12:34:56.789Z' }),
    __metadata("design:type", Date)
], NotificationDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=notification.dto.js.map