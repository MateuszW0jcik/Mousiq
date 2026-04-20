import {apiClient} from './api.service';
import type {Address, AddressRequest} from '../types/address.types';
import type {MessageResponse} from '../types/api.types';

export const addressService = {
    getUserAddresses: async (): Promise<Address[]> => {
        const response = await apiClient.get<Address[]>('/api/addresses');
        return response.data;
    },

    addAddress: async (request: AddressRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/api/addresses', request);
        return response.data;
    },

    editAddress: async (id: string, request: AddressRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>(`/api/addresses/${id}`, request);
        return response.data;
    },

    deleteAddress: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/addresses/${id}`);
    },
};

export default addressService;