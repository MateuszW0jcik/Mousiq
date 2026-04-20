export interface Address {
    id: string;
    country: string;
    postalCode: string;
    city: string;
    street: string;
    streetNumber: string;
}

export interface AddressRequest {
    country: string;
    postalCode: string;
    city: string;
    street: string;
    streetNumber: string;
}