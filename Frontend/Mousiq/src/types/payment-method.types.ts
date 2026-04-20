export interface PaymentMethod {
    id: string;
    userId: string;
    cardHolderName: string;
    cardLastFourDigits: string;
    cardBrand: string;
    expiryMonth: string;
    expiryYear: string;
    default: boolean;
    createdAt: string;
}

export interface PaymentMethodRequest {
    stripePaymentMethodId: string;
    cardHolderName: string;
    userEmail: string;
    isDefault: boolean;
}