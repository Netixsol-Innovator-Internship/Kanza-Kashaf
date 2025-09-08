export declare class AddressDto {
    addressLine1: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
}
export declare enum OrderPaymentMethod {
    MONEY = "money",
    POINTS = "points",
    HYBRID = "hybrid"
}
export declare class HybridSelectionDto {
    productId: string;
    method: 'money' | 'points';
}
export declare class CheckoutDto {
    address: AddressDto;
    paymentMethod: OrderPaymentMethod;
    cartId?: string;
    hybridSelections?: HybridSelectionDto[];
}
