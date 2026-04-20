import React, { useState } from 'react';
import { User, Mail, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-toastify';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';
import { parseApiError, isValidationError, getErrorMessage } from '../services/api.service';

interface LoginRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: (response: unknown) => void;
}

type TabType = 'login' | 'register';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    terms: boolean;
}

const LoginRegisterModal: React.FC<LoginRegisterModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const { login, loginViaGoogle, register } = useAuth();

    const [activeTab, setActiveTab] = useState<TabType>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState('');
    const [clickedOnOverlay, setClickedOnOverlay] = useState(false);

    const clientId = import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID;

    const [loginForm, setLoginForm] = useState<LoginForm>({
        email: '',
        password: '',
        remember: false
    });

    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        terms: false
    });

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setError('');
        setFieldErrors({});
        setSuccess('');
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setLoginForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setRegisterForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const loginRequest: LoginRequest = {
                email: loginForm.email,
                password: loginForm.password
            };

            const response = await login(loginRequest, loginForm.remember);

            setSuccess('Login successful!');
            onLoginSuccess?.(response);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            const apiError = parseApiError(err, 'Login failed');

            if (isValidationError(apiError)) {
                setFieldErrors(apiError.errors);
                setError('Please fix the errors below');
            } else {
                setError(getErrorMessage(apiError));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            toast.error('Google login failed - no credential received');
            return;
        }

        const idToken = credentialResponse.credential;
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const authResponse = await loginViaGoogle(idToken);

            setSuccess('Login successful!');
            onLoginSuccess?.(authResponse);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            const apiError = parseApiError(err, 'Google login failed');

            if (isValidationError(apiError)) {
                setFieldErrors(apiError.errors);
                setError('Please fix the errors below');
            } else {
                setError(getErrorMessage(apiError));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const registerRequest: RegisterRequest = {
                firstName: registerForm.firstName,
                lastName: registerForm.lastName,
                email: registerForm.email,
                password: registerForm.password
            };

            await register(registerRequest);

            setSuccess('Account created successfully! You can now log in.');
            setActiveTab('login');
            setRegisterForm({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                terms: false
            });
        } catch (err) {
            const apiError = parseApiError(err, 'Registration failed');

            if (isValidationError(apiError)) {
                setFieldErrors(apiError.errors);
                setError('Please fix the errors below');
            } else {
                setError(getErrorMessage(apiError));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setClickedOnOverlay(true);
        } else {
            setClickedOnOverlay(false);
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (clickedOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="bg-white rounded-lg p-5 w-full max-w-md shadow-lg">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-5">
                    <button
                        className={`flex-1 p-4 text-center border-none bg-none cursor-pointer text-base relative ${
                            activeTab === 'login' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                        onClick={() => handleTabChange('login')}
                    >
                        Log in
                        {activeTab === 'login' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                    <button
                        className={`flex-1 p-4 text-center border-none bg-none cursor-pointer text-base relative ${
                            activeTab === 'register' ? 'text-blue-600' : 'text-gray-600'
                        }`}
                        onClick={() => handleTabChange('register')}
                    >
                        Create Account
                        {activeTab === 'register' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                        )}
                    </button>
                </div>

                {/* Login Tab */}
                {activeTab === 'login' && (
                    <div className="animate-fade-in">
                        <h2 className="mb-5 text-2xl font-medium text-center">Log in to Mousiq</h2>
                        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    value={loginForm.email}
                                    onChange={handleLoginChange}
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 ${
                                        fieldErrors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.email && (
                                    <div className="absolute top-full left-0 mt-1 text-sm text-red-600">
                                        {fieldErrors.email}
                                    </div>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <Key className="absolute left-3 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={loginForm.password}
                                    onChange={handleLoginChange}
                                    required
                                    className={`w-full pl-10 pr-12 py-3 border rounded focus:outline-none focus:ring-2 ${
                                        fieldErrors.password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 bg-none border-none cursor-pointer p-0"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {fieldErrors.password && (
                                    <div className="absolute top-full left-0 mt-1 text-sm text-red-600">
                                        {fieldErrors.password}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="keepLogged"
                                    name="remember"
                                    checked={loginForm.remember}
                                    onChange={handleLoginChange}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="keepLogged" className="text-sm">
                                    Keep me logged in
                                </label>
                            </div>

                            {/* Error/Success Messages */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white border-none py-3 rounded cursor-pointer text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                            <GoogleOAuthProvider clientId={clientId}>
                                <div>
                                    <GoogleLogin
                                        onSuccess={handleGoogleLogin}
                                        onError={() => toast.error('Login failed!')}
                                    />
                                </div>
                            </GoogleOAuthProvider>
                        </form>
                    </div>
                )}

                {/* Register Tab */}
                {activeTab === 'register' && (
                    <div className="animate-fade-in">
                        <h2 className="mb-5 text-2xl font-medium text-center">Create your account</h2>
                        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                            <div className="relative flex items-center">
                                <User className="absolute left-3 w-5 h-5 text-gray-400"/>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={registerForm.firstName}
                                    onChange={handleRegisterChange}
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 ${
                                        fieldErrors.firstName
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.firstName && (
                                    <div className="absolute top-full left-0 mt-1 text-sm text-red-600">
                                        {fieldErrors.firstName}
                                    </div>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <User className="absolute left-3 w-5 h-5 text-gray-400"/>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={registerForm.lastName}
                                    onChange={handleRegisterChange}
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 ${
                                        fieldErrors.lastName
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.lastName && (
                                    <div className="absolute top-full left-0 mt-1 text-sm text-red-600">
                                        {fieldErrors.lastName}
                                    </div>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 w-5 h-5 text-gray-400"/>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    value={registerForm.email}
                                    onChange={handleRegisterChange}
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 ${
                                        fieldErrors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500'
                                    }`}
                                />
                                {fieldErrors.email && (
                                    <div className="absolute top-full left-0 mt-1 text-sm text-red-600">
                                        {fieldErrors.email}
                                    </div>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <Key className="absolute left-3 w-5 h-5 text-gray-400"/>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    value={registerForm.password}
                                    onChange={handleRegisterChange}
                                    required
                                    className={`w-full pl-10 pr-12 py-3 border rounded focus:outline-none focus:ring-2 ${
                                        fieldErrors.password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-200 focus:ring-blue-500'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 bg-none border-none cursor-pointer p-0"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 text-gray-400"/>
                                    ) : (
                                        <Eye className="w-5 h-5 text-gray-400"/>
                                    )}
                                </button>
                                {fieldErrors.password && (
                                    <div className="absolute top-full left-0 mt-1 text-sm text-red-600">
                                        {fieldErrors.password}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="termsAgree"
                                    name="terms"
                                    checked={registerForm.terms}
                                    onChange={handleRegisterChange}
                                    required
                                    className="w-4 h-4"
                                />
                                <label htmlFor="termsAgree" className="text-sm">
                                    I agree to all{' '}
                                    <Link
                                        to="/Terms and Conditions.pdf"
                                        className="text-blue-600 no-underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Terms & Conditions
                                    </Link>
                                </label>
                            </div>

                            {/* Error/Success Messages */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white border-none py-3 rounded cursor-pointer text-base hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginRegisterModal;