import { BidsService } from './bids.service';
import { PlaceBidDto } from './dto/place-bid.dto';
export declare class BidsController {
    private readonly bidsService;
    constructor(bidsService: BidsService);
    place(req: any, dto: PlaceBidDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/bid.schema").Bid, {}, {}> & import("../schemas/bid.schema").Bid & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getBidsForAuction(auctionId: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/bid.schema").Bid, {}, {}> & import("../schemas/bid.schema").Bid & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
