import { Document, Types } from 'mongoose';
export type ProductDocument = Product & Document;
export declare enum Category {
    TSHIRTS = "t-shirts",
    SHORTS = "shorts",
    SHIRTS = "shirts",
    HOODIE = "hoodie",
    JEANS = "jeans"
}
export declare enum Color {
    GREEN = "green",
    RED = "red",
    YELLOW = "yellow",
    ORANGE = "orange",
    BLUE = "blue",
    NAVY = "navy",
    PURPLE = "purple",
    PINK = "pink",
    WHITE = "white",
    BLACK = "black"
}
export declare enum Size {
    XXS = "xx-small",
    XS = "x-small",
    S = "small",
    M = "medium",
    L = "large",
    XL = "x-large",
    XXL = "xx-large",
    XXXL = "3x-large",
    XXXXL = "4x-large"
}
export declare enum Style {
    CASUAL = "casual",
    FORMAL = "formal",
    PARTY = "party",
    GYM = "gym"
}
export declare enum PaymentType {
    MONEY = "money",
    POINTS = "points",
    HYBRID = "hybrid"
}
export declare class VariantSize {
    size: Size;
    stock: number;
    sku?: string;
}
export declare const VariantSizeSchema: import("mongoose").Schema<VariantSize, import("mongoose").Model<VariantSize, any, any, any, Document<unknown, any, VariantSize> & VariantSize & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VariantSize, Document<unknown, {}, import("mongoose").FlatRecord<VariantSize>> & import("mongoose").FlatRecord<VariantSize> & {
    _id: Types.ObjectId;
}>;
export declare class ProductVariant {
    color: Color;
    images: string[];
    sizes: VariantSize[];
}
export declare const ProductVariantSchema: import("mongoose").Schema<ProductVariant, import("mongoose").Model<ProductVariant, any, any, any, Document<unknown, any, ProductVariant> & ProductVariant & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductVariant, Document<unknown, {}, import("mongoose").FlatRecord<ProductVariant>> & import("mongoose").FlatRecord<ProductVariant> & {
    _id: Types.ObjectId;
}>;
export declare class Product {
    name: string;
    description: string;
    category: Category;
    style?: Style;
    brand?: string;
    regularPrice: number;
    paymentType: PaymentType;
    discountPercent: number;
    salePercent: number;
    saleStartAt?: Date | null;
    saleEndAt?: Date | null;
    pointsPrice: number;
    ratingAvg: number;
    ratingCount: number;
    variants: ProductVariant[];
    active: boolean;
    salesCount: number;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
}>;
