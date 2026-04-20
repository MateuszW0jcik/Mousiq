/* eslint-disable react-refresh/only-export-components */
import React, {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import {authService} from '../services/auth.service';
import {userService} from '../services/user.service';
import {toast} from 'react-toastify';
import {getErrorMessage, parseApiError} from '../services/api.service';
import type {LoginRequest, RegisterRequest, LoginResponse} from '../types/auth.types';
import type {MeResponse} from '../types/user.types';

interface AuthContextType {
    user: MeResponse | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<LoginResponse>;
    loginViaGoogle: (idToken: string) => Promise<LoginResponse>;
    register: (userData: RegisterRequest) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<MeResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<MeResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                try {
                    const userData = await userService.getMe();
                    setUser(userData);
                    setIsAuthenticated(true);
                    setIsAdmin(userData.roles.includes('ADMIN'));
                } catch (error) {
                    const apiError = parseApiError(error, 'Failed to verify authentication');
                    console.error('Auth check failed:', getErrorMessage(apiError));

                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
                setUser(null);
            }
            setLoading(false);
        };

        checkAuthStatus();

        const handleLogoutEvent = () => {
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            toast.info('Session expired. Please log in again.');
        };

        window.addEventListener('auth-logout', handleLogoutEvent);

        return () => {
            window.removeEventListener('auth-logout', handleLogoutEvent);
        };
    }, []);

    const login = async (credentials: LoginRequest, rememberMe = false): Promise<LoginResponse> => {
        const response = await authService.login(credentials);

        if (rememberMe) {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
        } else {
            sessionStorage.setItem('accessToken', response.accessToken);
            sessionStorage.setItem('refreshToken', response.refreshToken);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }

        const userData = await userService.getMe();
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.roles.includes('ADMIN'));

        toast.success('Login successful!');

        return response;
    };

    const loginViaGoogle = async (idToken: string): Promise<LoginResponse> => {
        const response = await authService.loginViaGoogle(idToken);

        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');

        const userData = await userService.getMe();
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.roles.includes('ADMIN'));

        toast.success('Login successful!');

        return response;
    };

    const register = async (userData: RegisterRequest): Promise<boolean> => {
        await authService.register(userData);
        toast.success('Account created!');
        return true;
    };

    const logout = async (): Promise<void> => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');

        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);

        toast.success('Successfully logged out!');
    };

    const refreshUser = async (): Promise<MeResponse> => {
        try {
            const userData = await userService.getMe();
            setUser(userData);
            setIsAdmin(userData.roles.includes('ADMIN'));
            return userData;
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to refresh user data');
            console.error('Refresh user failed:', getErrorMessage(apiError));
            logout();
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        loginViaGoogle,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const withAuth = <P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
    return function AuthenticatedComponent(props: P) {
        const {isAuthenticated, loading} = useAuth();

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg">Loading...</div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                        <p className="text-gray-600">Please log in to access this page.</p>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};