export interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface ShippingMethodRequest {
    name: string;
    description: string;
    price: number;
}

export interface ShippingMethodListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    name?: string;
}