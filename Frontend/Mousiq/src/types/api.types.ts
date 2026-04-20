export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ValidationErrorResponse {
    [key: string]: string;
}

export interface ErrorResponse {
    status: number;
    message: string;
}

export interface MessageResponse {
    message: string;
}

export interface PageResponse<T> {
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export type StorageType = 'localStorage' | 'sessionStorage';

export interface ParsedValidationError {
    type: 'VALIDATION_ERROR';
    errors: ValidationErrorResponse;
}

export interface ParsedStandardError {
    type: 'STANDARD_ERROR';
    status: number | null;
    message: string;
}

export type ParsedApiError = ParsedValidationError | ParsedStandardError;