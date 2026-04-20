import {apiClient} from './api.service';
import type {Brand, BrandRequest, BrandListParams} from '../types/brand.types';
import type {PageResponse, MessageResponse} from '../types/api.types';

export const brandService = {
    getBrands: async (params?: BrandListParams): Promise<PageResponse<Brand>> => {
        const response = await apiClient.get<PageResponse<Brand>>('/api/brands', {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sortBy: params?.sortBy ?? 'name',
                sortDir: params?.sortDir ?? 'asc',
                name: params?.name,
            }
        });
        return response.data;
    },

    getAllBrands: async (): Promise<Brand[]> => {
        const response = await apiClient.get<Brand[]>('/api/brands/all');
        return response.data;
    },

    addBrand: async (request: BrandRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/api/brands', request);
        return response.data;
    },

    editBrand: async (id: string, request: BrandRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>(`/api/brands/${id}`, request);
        return response.data;
    },

    deleteBrand: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/brands/${id}`);
    },
};

export default brandService;