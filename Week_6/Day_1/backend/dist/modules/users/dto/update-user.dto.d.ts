declare class AddressDto {
    addressLine1: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
}
export declare class UpdateUserDto {
    name?: string;
    oldPassword?: string;
    newPassword?: string;
    addresses?: AddressDto[];
}
export {};
