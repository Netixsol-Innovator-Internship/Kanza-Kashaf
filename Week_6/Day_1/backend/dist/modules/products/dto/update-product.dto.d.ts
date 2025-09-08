import { CreateProductDto } from './create-product.dto';
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    salePercent?: number;
    saleStartAt?: string;
    saleEndAt?: string;
    regularPrice?: number;
}
export {};
