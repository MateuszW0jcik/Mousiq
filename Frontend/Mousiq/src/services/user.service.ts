import {apiClient} from './api.service';
import type {
    User,
    MeResponse,
    UserListParams,
    ChangeUserStatusRequest,
    EditUserFullNameRequest,
    ChangeUserPasswordRequest,
    ChangeUserLoginEmailRequest,
    RefreshResponse,
    UserDTO
} from '../types/user.types';
import type {PageResponse, MessageResponse} from '../types/api.types';

export const userService = {
    getUsers: async (params?: UserListParams): Promise<PageResponse<User>> => {
        const response = await apiClient.get<PageResponse<User>>('/api/users', {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sortBy: params?.sortBy ?? 'username',
                sortDir: params?.sortDir ?? 'asc',
                name: params?.name,
            }
        });
        return response.data;
    },

    getMe: async (): Promise<MeResponse> => {
        const response = await apiClient.get<MeResponse>('/api/users/me');
        return response.data;
    },

    changeUserStatus: async (request: ChangeUserStatusRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>('/api/users/status', request);
        return response.data;
    },

    updateFullName: async (request: EditUserFullNameRequest): Promise<UserDTO> => {
        const response = await apiClient.put<UserDTO>('/api/users/name', request);
        return response.data;
    },

    changePassword: async (request: ChangeUserPasswordRequest): Promise<MessageResponse> => {
        const response = await apiClient.put<MessageResponse>('/api/users/password', request);
        return response.data;
    },

    changeEmail: async (request: ChangeUserLoginEmailRequest): Promise<RefreshResponse> => {
        const response = await apiClient.put<RefreshResponse>('/api/users/email', request);
        return response.data;
    },
};

export default userService;