import {apiClient} from './api.service';
import type {
    Product,
    ProductSummary,
    ProductRequest,
    ProductFilterParams
} from '../types/product.types';
import type {PageResponse, MessageResponse} from '../types/api.types';

export const productService = {
    getProducts: async (params?: ProductFilterParams): Promise<PageResponse<ProductSummary>> => {
        const response = await apiClient.get<PageResponse<ProductSummary>>('/api/products', {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 12,
                sortBy: params?.sortBy ?? 'addedAt',
                sortDir: params?.sortDir ?? 'desc',
                name: params?.name,
                brandNames: params?.brandNames,
                wireless: params?.wireless,
                minPrice: params?.minPrice,
                maxPrice: params?.maxPrice,
                sensorType: params?.sensorType,
                connectionType: params?.connectionType,
                minDpi: params?.minDpi,
                maxDpi: params?.maxDpi,
            },
            paramsSerializer: {
                indexes: null,
            }
        });
        return response.data;
    },

    getProductById: async (id: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`/api/products/${id}`);
        return response.data;
    },

    getProductBySlug: async (slug: string): Promise<Product> => {
        const response = await apiClient.get<Product>(`/api/products/slug/${slug}`);
        return response.data;
    },

    getNewProducts: async (): Promise<ProductSummary[]> => {
        const response = await apiClient.get<ProductSummary[]>('/api/products/new');
        return response.data;
    },

    getBestSellers: async (): Promise<ProductSummary[]> => {
        const response = await apiClient.get<ProductSummary[]>('/api/products/best-sellers');
        return response.data;
    },

    addProduct: async (request: ProductRequest, image: File): Promise<MessageResponse> => {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        formData.append('image', image);

        const response = await apiClient.post<MessageResponse>('/api/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    editProduct: async (id: string, request: ProductRequest, image?: File): Promise<MessageResponse> => {
        const formData = new FormData();
        formData.append('request', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        if (image) {
            formData.append('image', image);
        }

        const response = await apiClient.put<MessageResponse>(`/api/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProduct: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/products/${id}`);
    },
};

export default productService;