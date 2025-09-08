import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Model, Connection, Types } from 'mongoose';
import { Product, ProductDocument, PaymentType } from '../../schemas/product.schema';
import { Review, ReviewDocument } from '../../schemas/review.schema';
import { SaleCampaign, SaleCampaignDocument } from '../../schemas/sale-campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { CloudinaryService } from './cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ProductsService implements OnModuleInit, OnModuleDestroy {
    private productModel;
    private reviewModel;
    private campaignModel;
    private cloudinary;
    private notifications;
    private readonly connection;
    constructor(productModel: Model<ProductDocument>, reviewModel: Model<ReviewDocument>, campaignModel: Model<SaleCampaignDocument>, cloudinary: CloudinaryService, notifications: NotificationsService, connection: Connection);
    private campaignTimer;
    onModuleInit(): void;
    onModuleDestroy(): void;
    private computePointsPrice;
    private computeEffectiveSalePercent;
    private computeSalePrice;
    createProduct(dto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, ProductDocument> & Product & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<import("mongoose").Document<unknown, {}, ProductDocument> & Product & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    deleteProduct(id: string): Promise<{
        ok: boolean;
    }>;
    uploadImages(images: string[]): Promise<any[]>;
    getProduct(id: string): Promise<{
        salePercent: number;
        salePrice: number;
        pointsPrice: number;
        name: string;
        description: string;
        category: import("../../schemas/product.schema").Category;
        style?: import("../../schemas/product.schema").Style;
        brand?: string;
        regularPrice: number;
        paymentType: PaymentType;
        discountPercent: number;
        saleStartAt?: Date | null;
        saleEndAt?: Date | null;
        ratingAvg: number;
        ratingCount: number;
        variants: import("mongoose").FlattenMaps<import("../../schemas/product.schema").ProductVariant>[];
        active: boolean;
        salesCount: number;
        _id: any;
        __v?: any;
        $assertPopulated: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<ProductDocument, keyof Paths> & Paths;
        $clone: () => ProductDocument;
        $getAllSubdocs: () => import("mongoose").Document[];
        $ignore: (path: string) => void;
        $isDefault: (path: string) => boolean;
        $isDeleted: (val?: boolean) => boolean;
        $getPopulatedDocs: () => import("mongoose").Document[];
        $inc: (path: string | string[], val?: number) => ProductDocument;
        $isEmpty: (path: string) => boolean;
        $isValid: (path: string) => boolean;
        $locals: import("mongoose").FlattenMaps<Record<string, unknown>>;
        $markValid: (path: string) => void;
        $model: {
            <ModelType = Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = Model<any, {}, {}, {}, any, any>>(): ModelType;
        };
        $op: "save" | "validate" | "remove" | null;
        $session: (session?: import("mongoose").ClientSession | null) => import("mongoose").ClientSession | null;
        $set: {
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): ProductDocument;
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): ProductDocument;
            (value: string | Record<string, any>): ProductDocument;
        };
        $where: import("mongoose").FlattenMaps<Record<string, unknown>>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").FlattenMaps<Connection>;
        deleteOne: (options?: import("mongoose").QueryOptions) => Promise<ProductDocument>;
        depopulate: (path?: string | string[]) => ProductDocument;
        directModifiedPaths: () => Array<string>;
        equals: (doc: import("mongoose").Document<any, any, any>) => boolean;
        errors?: import("mongoose").Error.ValidationError;
        get: {
            <T extends string | number | symbol>(path: T, type?: any, options?: any): any;
            (path: string, type?: any, options?: any): any;
        };
        getChanges: () => import("mongoose").UpdateQuery<ProductDocument>;
        id?: any;
        increment: () => ProductDocument;
        init: (obj: import("mongoose").AnyObject, opts?: import("mongoose").AnyObject) => ProductDocument;
        invalidate: {
            <T extends string | number | symbol>(path: T, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
            (path: string, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
        };
        isDirectModified: {
            <T extends string | number | symbol>(path: T | T[]): boolean;
            (path: string | Array<string>): boolean;
        };
        isDirectSelected: {
            <T extends string | number | symbol>(path: T): boolean;
            (path: string): boolean;
        };
        isInit: {
            <T extends string | number | symbol>(path: T): boolean;
            (path: string): boolean;
        };
        isModified: {
            <T extends string | number | symbol>(path?: T | T[], options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
            (path?: string | Array<string>, options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
        };
        isNew: boolean;
        isSelected: {
            <T extends string | number | symbol>(path: T): boolean;
            (path: string): boolean;
        };
        markModified: {
            <T extends string | number | symbol>(path: T, scope?: any): void;
            (path: string, scope?: any): void;
        };
        model: {
            <ModelType = Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = Model<any, {}, {}, {}, any, any>>(): ModelType;
        };
        modifiedPaths: (options?: {
            includeChildren?: boolean;
        }) => Array<string>;
        overwrite: (obj: import("mongoose").AnyObject) => ProductDocument;
        $parent: () => import("mongoose").Document | undefined;
        populate: {
            <Paths = {}>(path: string | import("mongoose").PopulateOptions | (string | import("mongoose").PopulateOptions)[]): Promise<import("mongoose").MergeType<ProductDocument, Paths>>;
            <Paths = {}>(path: string, select?: string | import("mongoose").AnyObject, model?: Model<any>, match?: import("mongoose").AnyObject, options?: import("mongoose").PopulateOptions): Promise<import("mongoose").MergeType<ProductDocument, Paths>>;
        };
        populated: (path: string) => any;
        replaceOne: (replacement?: import("mongoose").AnyObject, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, ProductDocument, {}, ProductDocument, "find">;
        save: (options?: import("mongoose").SaveOptions) => Promise<ProductDocument>;
        schema: import("mongoose").FlattenMaps<import("mongoose").Schema<any, Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
            [x: string]: any;
        }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
            [x: string]: any;
        }>> & import("mongoose").FlatRecord<{
            [x: string]: any;
        }> & Required<{
            _id: unknown;
        }>>>;
        set: {
            <T extends string | number | symbol>(path: T, val: any, type: any, options?: import("mongoose").DocumentSetOptions): ProductDocument;
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): ProductDocument;
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): ProductDocument;
            (value: string | Record<string, any>): ProductDocument;
        };
        toJSON: {
            <T = any>(options?: import("mongoose").ToObjectOptions & {
                flattenMaps?: true;
            }): import("mongoose").FlattenMaps<T>;
            <T = any>(options: import("mongoose").ToObjectOptions & {
                flattenMaps: false;
            }): T;
        };
        toObject: <T = any>(options?: import("mongoose").ToObjectOptions) => import("mongoose").Require_id<T>;
        unmarkModified: {
            <T extends string | number | symbol>(path: T): void;
            (path: string): void;
        };
        updateOne: (update?: import("mongoose").UpdateWithAggregationPipeline | import("mongoose").UpdateQuery<ProductDocument>, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, ProductDocument, {}, ProductDocument, "find">;
        validate: {
            <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): Promise<void>;
            (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): Promise<void>;
            (options: {
                pathsToSkip?: import("mongoose").pathsToSkip;
            }): Promise<void>;
        };
        validateSync: {
            (options: {
                pathsToSkip?: import("mongoose").pathsToSkip;
                [k: string]: any;
            }): import("mongoose").Error.ValidationError | null;
            <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
            (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
        };
    }>;
    listProducts(filters: FilterProductsDto): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    private userHasPurchasedProduct;
    addOrUpdateReview(userId: string, productId: string, rating: number, comment?: string): Promise<import("mongoose").Document<unknown, {}, ReviewDocument> & Review & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    deleteReview(userId: string, productId: string, reviewId: string): Promise<{
        ok: boolean;
    }>;
    private recalculateProductRating;
    createCampaign(dto: CreateCampaignDto): Promise<import("mongoose").Document<unknown, {}, SaleCampaignDocument> & SaleCampaign & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }>;
    processCampaignNotifications(): Promise<{
        started: number;
        ended: number;
    }>;
    listActiveCampaigns(): Promise<(import("mongoose").Document<unknown, {}, SaleCampaignDocument> & SaleCampaign & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    })[]>;
    getNewArrivals(limit?: number): Promise<any[]>;
    getTopSelling(limit?: number): Promise<any[]>;
    getReviews(productId: string, page?: number, limit?: number, sort?: 'latest' | 'oldest'): Promise<{
        items: (import("mongoose").FlattenMaps<ReviewDocument> & {
            _id: Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTopRatedReviews(page?: number, limit?: number): Promise<{
        items: (import("mongoose").FlattenMaps<ReviewDocument> & {
            _id: Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
}
