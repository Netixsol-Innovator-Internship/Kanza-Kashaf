import { Category, Color, Size, Style, PaymentType } from '../../../schemas/product.schema';
declare class SizeDto {
    size: Size;
    stock: number;
    sku?: string;
}
declare class VariantDto {
    color: Color;
    images: string[];
    sizes: SizeDto[];
}
export declare class CreateProductDto {
    name: string;
    description: string;
    category: Category;
    style: Style;
    brand?: string;
    regularPrice: number;
    paymentType: PaymentType;
    discountPercent?: number;
    variants?: VariantDto[];
}
export {};
