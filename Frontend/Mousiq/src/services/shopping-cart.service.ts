import {apiClient} from './api.service';
import type {ShoppingCartItem, ShoppingCartItemRequest, UpdateQuantityRequest} from '../types/shopping-cart.types';
import type {MessageResponse} from '../types/api.types';

export const shoppingCartService = {
    getUserCart: async (): Promise<ShoppingCartItem[]> => {
        const response = await apiClient.get<ShoppingCartItem[]>('/api/cart');
        return response.data;
    },

    addToCart: async (request: ShoppingCartItemRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/api/cart', request);
        return response.data;
    },

    updateCartItem: async (id: string, request: UpdateQuantityRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>(`/api/cart/${id}`, request);
        return response.data;
    },

    removeFromCart: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/cart/${id}`);
    },
};

export default shoppingCartService;