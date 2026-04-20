import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Search, User as UserIcon, Mail, Calendar} from "lucide-react";
import Pagination from "../../components/Pagination.jsx";
import userService from "../../services/user.service.ts";
import {toast} from "react-toastify";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {type User} from "../../types/user.types.js";

const DashboardUsers: React.FC = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
    const currentPage = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (!loading && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [loading]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await userService.getUsers({
                    page: currentPage - 1,
                    size: 10,
                    sortBy: 'createdAt',
                    sortDir: 'desc',
                    name: debouncedSearchTerm
                });
                setUsers(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to load users');
                toast.error(getErrorMessage(apiError));
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [debouncedSearchTerm, searchParams]);

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(newPage));
        setSearchParams(newParams);
        window.scrollTo(0, 0);
    };

    const handleStatusChange = async (userId: string, field: 'admin' | 'active', newValue: boolean) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        setUpdatingUsers(prev => new Set(prev).add(userId));

        try {
            const request = {
                userId: userId,
                admin: field === 'admin' ? newValue : user.admin,
                active: field === 'active' ? newValue : user.active
            };

            await userService.changeUserStatus(request);

            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === userId
                        ? { ...u, [field]: newValue }
                        : u
                )
            );

            toast.success(`User ${field} status updated successfully`);
        } catch (error) {
            const apiError = parseApiError(error, `Failed to update user ${field} status`);
            toast.error(getErrorMessage(apiError));
            console.error(`Failed to update user ${field} status:`, error);
        } finally {
            setUpdatingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-5">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-2">Manage customer accounts and permissions</p>
            </div>

            <div className="flex items-center w-full border border-gray-300 rounded-lg px-3 py-2 bg-white mb-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <Search className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0"/>
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name or email..."
                    autoComplete="off"
                    className="flex-1 outline-none bg-transparent text-sm"
                />
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 mb-4">
                        <UserIcon className="w-16 h-16 mx-auto flex-shrink-0" strokeWidth={1.5}/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Users Found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try a different search term' : 'Registered users will appear here'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Admin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                        {user.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                            <span className="font-medium">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="relative inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={user.admin}
                                                    onChange={(e) => handleStatusChange(user.id, 'admin', e.target.checked)}
                                                    disabled={updatingUsers.has(user.id)}
                                                    className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                                                />
                                            </div>
                                            {updatingUsers.has(user.id) && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="relative inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={user.active}
                                                    onChange={(e) => handleStatusChange(user.id, 'active', e.target.checked)}
                                                    disabled={updatingUsers.has(user.id)}
                                                    className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50 cursor-pointer"
                                                />
                                            </div>
                                            {updatingUsers.has(user.id) && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                            {formatDate(user.createdAt)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {users.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-6"
                />
            )}
        </div>
    );
};

export default DashboardUsers;