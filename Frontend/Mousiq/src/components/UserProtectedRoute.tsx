import React from 'react';
import {useAuth} from '../contexts/AuthContext';
import {Link} from 'react-router-dom';

interface UserProtectedRouteProps {
    children: React.ReactNode;
}

const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({children}) => {
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
                    <p className="text-gray-600 mb-4">Please log in to access this page.</p>
                    <Link
                        to="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 hover:scale-105 transform"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default UserProtectedRoute;