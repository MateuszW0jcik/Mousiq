import {apiClient} from './api.service';
import type {LoginRequest, RegisterRequest, LoginResponse} from '../types/auth.types';

export const authService = {
    login: async (loginRequest: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/api/auth/login', loginRequest);
        return response.data;
    },

    loginViaGoogle: async (idToken: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/api/auth/login/google', {idToken});
        return response.data;
    },

    register: async (registerRequest: RegisterRequest): Promise<void> => {
        await apiClient.post('/api/auth/register', registerRequest);
    },

    refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/api/auth/token/refresh', {
            refreshToken,
        });
        return response.data;
    },

    logout: (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth-logout'));
    },

    isLoggedIn: (): boolean => {
        return localStorage.getItem('accessToken') !== null ||
            sessionStorage.getItem('accessToken') !== null;
    },

    getAccessToken: (): string | null => {
        return localStorage.getItem('accessToken') ||
            sessionStorage.getItem('accessToken');
    }
};

export default authService;