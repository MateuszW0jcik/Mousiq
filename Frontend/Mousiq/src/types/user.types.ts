export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    admin: boolean;
    active: boolean;
    createdAt: string;
}

export interface MeResponse {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

export interface UserDTO {
    firstName: string;
    lastName: string;
    email: string;
}

export interface ChangeUserStatusRequest {
    userId: string;
    admin: boolean;
    active: boolean;
}

export interface EditUserFullNameRequest {
    firstName: string;
    lastName: string;
}

export interface ChangeUserPasswordRequest {
    oldPassword: string;
    newPassword: string;
    repeatedPassword: string;
}

export interface ChangeUserLoginEmailRequest {
    currentPassword: string;
    email: string;
}

export interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

export interface UserListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    name?: string;
}