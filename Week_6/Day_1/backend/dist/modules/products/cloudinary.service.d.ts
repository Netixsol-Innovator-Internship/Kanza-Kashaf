export declare class CloudinaryService {
    constructor();
    uploadBase64(base64: string, folder?: string): Promise<{
        url: string;
    }>;
}
