import { Category, Color, Size, Style } from '../../../schemas/product.schema';
export declare class FilterProductsDto {
    category?: Category;
    priceMin?: number;
    priceMax?: number;
    colors?: Color[];
    sizes?: Size[];
    styles?: Style[];
    page?: number;
    limit?: number;
}
