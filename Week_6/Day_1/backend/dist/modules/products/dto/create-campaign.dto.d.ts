export declare class CreateCampaignDto {
    name: string;
    description?: string;
    percent: number;
    productIds?: string[];
    categories?: string[];
    startAt: Date;
    endAt: Date;
}
