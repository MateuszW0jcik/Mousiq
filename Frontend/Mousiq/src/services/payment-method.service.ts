import {apiClient} from './api.service';
import type {PaymentMethod, PaymentMethodRequest} from '../types/payment-method.types.ts';
import type {MessageResponse} from '../types/api.types';

export const paymentMethodService = {
    getUserPaymentMethods: async (): Promise<PaymentMethod[]> => {
        const response = await apiClient.get<PaymentMethod[]>('/api/payment-methods');
        return response.data;
    },

    addPaymentMethod: async (request: PaymentMethodRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/api/payment-methods', request);
        return response.data;
    },

    setDefaultPaymentMethod: async (id: string): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>(`/api/payment-methods/${id}/default`);
        return response.data;
    },

    deletePaymentMethod: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/payment-methods/${id}`);
    },
};

export default paymentMethodService;