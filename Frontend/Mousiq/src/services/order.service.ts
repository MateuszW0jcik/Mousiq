import {apiClient} from './api.service';
import type {
    Order,
    OrderSummary,
    OrderRequest,
    UpdateOrderStatusRequest,
    OrderListParams,
    AdminOrderListParams
} from '../types/order.types';
import type {PageResponse, MessageResponse} from '../types/api.types';

export const orderService = {
    getUserOrders: async (params?: OrderListParams): Promise<PageResponse<OrderSummary>> => {
        const response = await apiClient.get<PageResponse<OrderSummary>>('/api/orders', {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sortBy: params?.sortBy ?? 'createdAt',
                sortDir: params?.sortDir ?? 'desc',
            }
        });
        return response.data;
    },

    getAllOrders: async (params?: AdminOrderListParams): Promise<PageResponse<OrderSummary>> => {
        const response = await apiClient.get<PageResponse<OrderSummary>>('/api/orders/all', {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sortBy: params?.sortBy ?? 'createdAt',
                sortDir: params?.sortDir ?? 'desc',
                ownerName: params?.ownerName,
            }
        });
        return response.data;
    },

    getOrderDetailsAdmin: async (id: string): Promise<Order> => {
        const response = await apiClient.get<Order>(`/api/orders/${id}/admin`);
        return response.data;
    },

    getUserOrderDetails: async (id: string): Promise<Order> => {
        const response = await apiClient.get<Order>(`/api/orders/${id}`);
        return response.data;
    },

    createOrder: async (request: OrderRequest): Promise<OrderSummary> => {
        const response = await apiClient.post<OrderSummary>('/api/orders', request);
        return response.data;
    },

    updateOrderStatus: async (id: string, request: UpdateOrderStatusRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>(`/api/orders/${id}/status`, request);
        return response.data;
    },
};

export default orderService;