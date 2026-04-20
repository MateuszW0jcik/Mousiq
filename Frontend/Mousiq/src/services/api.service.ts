import axios from 'axios';
import type {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import type {
    RefreshTokenResponse,
    ValidationErrorResponse,
    ErrorResponse,
    StorageType,
    ParsedApiError, ParsedValidationError, ParsedStandardError
} from '../types/api.types';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        let token = localStorage.getItem('accessToken');
        if (!token) {
            token = sessionStorage.getItem('accessToken');
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            let refreshToken = localStorage.getItem('refreshToken');
            let storageType: StorageType = 'localStorage';

            if (!refreshToken) {
                refreshToken = sessionStorage.getItem('refreshToken');
                storageType = 'sessionStorage';
            }

            if (refreshToken) {
                try {
                    const response = await axios.post<RefreshTokenResponse>(
                        `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/token/refresh`,
                        {refreshToken},
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    console.log("response.data: " + response.data);

                    const {accessToken, refreshToken: newRefreshToken} = response.data;

                    if (storageType === 'localStorage') {
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);
                    } else {
                        sessionStorage.setItem('accessToken', accessToken);
                        sessionStorage.setItem('refreshToken', newRefreshToken);
                    }

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    clearAuthData();
                    window.dispatchEvent(new Event('auth-logout'));
                    return Promise.reject(refreshError);
                }
            } else {
                clearAuthData();
                window.dispatchEvent(new Event('auth-logout'));
            }
        }

        return Promise.reject(error);
    }
);

const clearAuthData = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
};

export const parseApiError = (error: unknown, customMessage?: string): ParsedApiError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;

        if (axiosError.response) {
            const {status, data} = axiosError.response;

            if (
                status === 400 &&
                data &&
                typeof data === 'object' &&
                !Array.isArray(data) &&
                !('message' in data) &&
                !('status' in data)
            ) {
                return {
                    type: 'VALIDATION_ERROR',
                    errors: data as ValidationErrorResponse
                };
            }

            return {
                type: 'STANDARD_ERROR',
                status,
                message: data?.message || axiosError.message || customMessage || 'An error occurred'
            };
        }

        if (axiosError.request) {
            return {
                type: 'STANDARD_ERROR',
                status: null,
                message: 'No response from the server. Check your Internet connection.'
            };
        }
    }

    return {
        type: 'STANDARD_ERROR',
        status: null,
        message: error instanceof Error ? error.message : customMessage || 'Unexpected error'
    };
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
};

export const isAuthenticated = (): boolean => {
    return getAuthToken() !== null;
};

export const isValidationError = (error: ParsedApiError): error is ParsedValidationError => {
    return error.type === 'VALIDATION_ERROR';
};

export const isStandardError = (error: ParsedApiError): error is ParsedStandardError => {
    return error.type === 'STANDARD_ERROR';
};

export const getErrorMessage = (error: ParsedApiError): string => {
    if (isStandardError(error)) {
        return error.message;
    }
    return 'Validation errors occurred';
};