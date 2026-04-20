import {apiClient} from './api.service';
import type {ShippingMethod, ShippingMethodRequest, ShippingMethodListParams} from '../types/shipping-method.types';
import type {PageResponse, MessageResponse} from '../types/api.types';

export const shippingMethodService = {
    getAllShippingMethods: async (): Promise<ShippingMethod[]> => {
        const response = await apiClient.get<ShippingMethod[]>('/api/shipping-methods/all');
        return response.data;
    },

    getShippingMethods: async (params?: ShippingMethodListParams): Promise<PageResponse<ShippingMethod>> => {
        const response = await apiClient.get<PageResponse<ShippingMethod>>('/api/shipping-methods', {
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

    addShippingMethod: async (request: ShippingMethodRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/api/shipping-methods', request);
        return response.data;
    },

    editShippingMethod: async (id: string, request: ShippingMethodRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>(`/api/shipping-methods/${id}`, request);
        return response.data;
    },

    deleteShippingMethod: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/shipping-methods/${id}`);
    },
};

export default shippingMethodService;