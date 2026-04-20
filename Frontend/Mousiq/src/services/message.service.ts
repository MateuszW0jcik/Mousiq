import {apiClient} from './api.service';
import type {Message, MessageRequest, MessageListParams} from '../types/message.types';
import type {PageResponse, MessageResponse} from '../types/api.types';

export const messageService = {
    getMessages: async (params?: MessageListParams): Promise<PageResponse<Message>> => {
        const response = await apiClient.get<PageResponse<Message>>('/api/messages', {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sortBy: params?.sortBy ?? 'sentAt',
                sortDir: params?.sortDir ?? 'desc',
            }
        });
        return response.data;
    },

    createMessage: async (request: MessageRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>('/api/messages', request);
        return response.data;
    },

    deleteMessage: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/messages/${id}`);
    },
};

export default messageService;