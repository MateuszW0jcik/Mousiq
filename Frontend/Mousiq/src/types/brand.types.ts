export interface Brand {
    id: string;
    name: string;
}

export interface BrandRequest {
    name: string;
}

export interface BrandListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    name?: string;
}