import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
export declare class ProductsController {
    private readonly products;
    constructor(products: ProductsService);
    getNewArrivals(page?: string, limit?: string): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTopSelling(page?: string, limit?: string): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    list(query: any): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    getReviews(id: string, page?: string, limit?: string, sort?: string): Promise<{
        items: (import("mongoose").FlattenMaps<import("../../schemas/review.schema").ReviewDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/product.schema").ProductDocument> & import("../../schemas/product.schema").Product & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/product.schema").ProductDocument> & import("../../schemas/product.schema").Product & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(id: string): Promise<{
        ok: boolean;
    }>;
    get(id: string): Promise<{
        salePercent: number;
        salePrice: number;
        pointsPrice: number;
        name: string;
        description: string;
        category: import("../../schemas/product.schema").Category;
        style?: import("../../schemas/product.schema").Style;
        brand?: string;
        regularPrice: number;
        paymentType: import("../../schemas/product.schema").PaymentType;
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
        $assertPopulated: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<import("../../schemas/product.schema").ProductDocument, keyof Paths> & Paths;
        $clone: () => import("../../schemas/product.schema").ProductDocument;
        $getAllSubdocs: () => import("mongoose").Document[];
        $ignore: (path: string) => void;
        $isDefault: (path: string) => boolean;
        $isDeleted: (val?: boolean) => boolean;
        $getPopulatedDocs: () => import("mongoose").Document[];
        $inc: (path: string | string[], val?: number) => import("../../schemas/product.schema").ProductDocument;
        $isEmpty: (path: string) => boolean;
        $isValid: (path: string) => boolean;
        $locals: import("mongoose").FlattenMaps<Record<string, unknown>>;
        $markValid: (path: string) => void;
        $model: {
            <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
        };
        $op: "save" | "validate" | "remove" | null;
        $session: (session?: import("mongoose").ClientSession | null) => import("mongoose").ClientSession | null;
        $set: {
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("../../schemas/product.schema").ProductDocument;
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("../../schemas/product.schema").ProductDocument;
            (value: string | Record<string, any>): import("../../schemas/product.schema").ProductDocument;
        };
        $where: import("mongoose").FlattenMaps<Record<string, unknown>>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").FlattenMaps<import("mongoose").Connection>;
        deleteOne: (options?: import("mongoose").QueryOptions) => Promise<import("../../schemas/product.schema").ProductDocument>;
        depopulate: (path?: string | string[]) => import("../../schemas/product.schema").ProductDocument;
        directModifiedPaths: () => Array<string>;
        equals: (doc: import("mongoose").Document<any, any, any>) => boolean;
        errors?: import("mongoose").Error.ValidationError;
        get: {
            <T extends string | number | symbol>(path: T, type?: any, options?: any): any;
            (path: string, type?: any, options?: any): any;
        };
        getChanges: () => import("mongoose").UpdateQuery<import("../../schemas/product.schema").ProductDocument>;
        id?: any;
        increment: () => import("../../schemas/product.schema").ProductDocument;
        init: (obj: import("mongoose").AnyObject, opts?: import("mongoose").AnyObject) => import("../../schemas/product.schema").ProductDocument;
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
            <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
                _id: unknown;
            }>, any>>(name: string): ModelType;
            <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
        };
        modifiedPaths: (options?: {
            includeChildren?: boolean;
        }) => Array<string>;
        overwrite: (obj: import("mongoose").AnyObject) => import("../../schemas/product.schema").ProductDocument;
        $parent: () => import("mongoose").Document | undefined;
        populate: {
            <Paths = {}>(path: string | import("mongoose").PopulateOptions | (string | import("mongoose").PopulateOptions)[]): Promise<import("mongoose").MergeType<import("../../schemas/product.schema").ProductDocument, Paths>>;
            <Paths = {}>(path: string, select?: string | import("mongoose").AnyObject, model?: import("mongoose").Model<any>, match?: import("mongoose").AnyObject, options?: import("mongoose").PopulateOptions): Promise<import("mongoose").MergeType<import("../../schemas/product.schema").ProductDocument, Paths>>;
        };
        populated: (path: string) => any;
        replaceOne: (replacement?: import("mongoose").AnyObject, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("../../schemas/product.schema").ProductDocument, {}, import("../../schemas/product.schema").ProductDocument, "find">;
        save: (options?: import("mongoose").SaveOptions) => Promise<import("../../schemas/product.schema").ProductDocument>;
        schema: import("mongoose").FlattenMaps<import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
            [x: string]: any;
        }, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
            [x: string]: any;
        }>> & import("mongoose").FlatRecord<{
            [x: string]: any;
        }> & Required<{
            _id: unknown;
        }>>>;
        set: {
            <T extends string | number | symbol>(path: T, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("../../schemas/product.schema").ProductDocument;
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("../../schemas/product.schema").ProductDocument;
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("../../schemas/product.schema").ProductDocument;
            (value: string | Record<string, any>): import("../../schemas/product.schema").ProductDocument;
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
        updateOne: (update?: import("mongoose").UpdateWithAggregationPipeline | import("mongoose").UpdateQuery<import("../../schemas/product.schema").ProductDocument>, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("../../schemas/product.schema").ProductDocument, {}, import("../../schemas/product.schema").ProductDocument, "find">;
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
    filter(dto: FilterProductsDto): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
    }>;
    uploadImages(images: string[]): Promise<any[]>;
    addOrUpdateReview(req: any, productId: string, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/review.schema").ReviewDocument> & import("../../schemas/review.schema").Review & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getTopRatedReviews(page?: string, limit?: string): Promise<{
        items: (import("mongoose").FlattenMaps<import("../../schemas/review.schema").ReviewDocument> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    createCampaign(dto: CreateCampaignDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/sale-campaign.schema").SaleCampaignDocument> & import("../../schemas/sale-campaign.schema").SaleCampaign & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    listActiveCampaigns(): Promise<(import("mongoose").Document<unknown, {}, import("../../schemas/sale-campaign.schema").SaleCampaignDocument> & import("../../schemas/sale-campaign.schema").SaleCampaign & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
