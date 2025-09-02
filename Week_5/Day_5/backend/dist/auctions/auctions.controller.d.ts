import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
export declare class AuctionsController {
    private readonly auctionsService;
    constructor(auctionsService: AuctionsService);
    create(req: any, dto: CreateAuctionDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/auction.schema").Auction, {}, {}> & import("../schemas/auction.schema").Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    list(query: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/auction.schema").Auction, {}, {}> & import("../schemas/auction.schema").Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getMine(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/auction.schema").Auction, {}, {}> & import("../schemas/auction.schema").Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    get(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/auction.schema").Auction, {}, {}> & import("../schemas/auction.schema").Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    end(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/auction.schema").Auction, {}, {}> & import("../schemas/auction.schema").Auction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    toggleWishlist(id: string, req: any): Promise<{
        wishlist: import("mongoose").Types.ObjectId[];
        added: boolean;
    }>;
}
