export declare class CreateAuctionDto {
    vin: string;
    year: number;
    make: string;
    carModel: string;
    mileage: number;
    engineSize: string;
    paint: string;
    hasGccSpecs: string;
    features?: string;
    accidentHistory: string;
    serviceHistory: string;
    modificationStatus: string;
    minBid: number;
    photos: string[];
    startTime: string;
    endTime: string;
    minIncrement: number;
}
