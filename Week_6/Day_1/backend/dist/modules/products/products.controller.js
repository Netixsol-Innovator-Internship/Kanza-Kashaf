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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const filter_products_dto_1 = require("./dto/filter-products.dto");
const create_review_dto_1 = require("./dto/create-review.dto");
const create_campaign_dto_1 = require("./dto/create-campaign.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/guards/roles.decorator");
const user_schema_1 = require("../../schemas/user.schema");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    constructor(products) {
        this.products = products;
    }
    async getNewArrivals(page, limit) {
        const l = limit ? parseInt(limit, 10) : 15;
        const p = page ? parseInt(page, 10) : 1;
        const items = await this.products.getNewArrivals(l);
        return {
            items,
            total: items.length,
            page: p,
            limit: l,
        };
    }
    async getTopSelling(page, limit) {
        const l = limit ? parseInt(limit, 10) : 15;
        const p = page ? parseInt(page, 10) : 1;
        const items = await this.products.getTopSelling(l);
        return {
            items,
            total: items.length,
            page: p,
            limit: l,
        };
    }
    async list(query) {
        const dto = {};
        if (query.category)
            dto.category = query.category;
        if (query.priceMin)
            dto.priceMin = Number(query.priceMin);
        if (query.priceMax)
            dto.priceMax = Number(query.priceMax);
        if (query.page)
            dto.page = Number(query.page);
        if (query.limit)
            dto.limit = Number(query.limit);
        const parseArray = (v) => {
            if (!v)
                return undefined;
            if (Array.isArray(v))
                return v;
            return v.split(',').map((s) => s.trim()).filter(Boolean);
        };
        const colors = parseArray(query.colors);
        const sizes = parseArray(query.sizes);
        const styles = parseArray(query.styles);
        if (colors)
            dto.colors = colors;
        if (sizes)
            dto.sizes = sizes;
        if (styles)
            dto.styles = styles;
        return this.products.listProducts(dto);
    }
    async getReviews(id, page, limit, sort) {
        const p = page ? parseInt(page, 10) : 1;
        const l = limit ? parseInt(limit, 10) : 6;
        const s = sort === 'oldest' ? 'oldest' : 'latest';
        return this.products.getReviews(id, p, l, s);
    }
    async create(dto) {
        return this.products.createProduct(dto);
    }
    async update(id, dto) {
        return this.products.updateProduct(id, dto);
    }
    async delete(id) {
        return this.products.deleteProduct(id);
    }
    async get(id) {
        return this.products.getProduct(id);
    }
    async filter(dto) {
        return this.products.listProducts(dto);
    }
    async uploadImages(images) {
        return this.products.uploadImages(images);
    }
    async addOrUpdateReview(req, productId, dto) {
        return this.products.addOrUpdateReview(req.user.userId, productId, dto.rating, dto.comment);
    }
    async getTopRatedReviews(page, limit) {
        const p = page ? parseInt(page, 10) : 1;
        const l = limit ? parseInt(limit, 10) : 10;
        return this.products.getTopRatedReviews(p, l);
    }
    async createCampaign(dto) {
        return this.products.createCampaign(dto);
    }
    async listActiveCampaigns() {
        return this.products.listActiveCampaigns();
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)('new-arrivals'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getNewArrivals", null);
__decorate([
    (0, common_1.Get)('top-selling'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getTopSelling", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getReviews", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiBody)({ type: create_product_dto_1.CreateProductDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBody)({ type: update_product_dto_1.UpdateProductDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)('filter'),
    (0, swagger_1.ApiBody)({ type: filter_products_dto_1.FilterProductsDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_products_dto_1.FilterProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "filter", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: { type: 'string', example: 'data:image/png;base64,...' },
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)('images')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/reviews'),
    (0, swagger_1.ApiBody)({ type: create_review_dto_1.CreateReviewDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addOrUpdateReview", null);
__decorate([
    (0, common_1.Get)('reviews/top-rated'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getTopRatedReviews", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.Role.ADMIN, user_schema_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('campaigns'),
    (0, swagger_1.ApiBody)({ type: create_campaign_dto_1.CreateCampaignDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_campaign_dto_1.CreateCampaignDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)('campaigns/active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "listActiveCampaigns", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map