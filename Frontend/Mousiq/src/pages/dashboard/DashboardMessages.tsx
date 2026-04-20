import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import messageService from "../../services/message.service.ts";
import Pagination from "../../components/Pagination.jsx";
import {toast} from "react-toastify";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {type Message} from "../../types/message.types.js";
import {Mail, Trash2, User, Calendar} from 'lucide-react';

const DashboardMessages: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    const currentPage = parseInt(searchParams.get('page') || '1');

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await messageService.getMessages({
                page: currentPage - 1,
                size: 10,
                sortBy: 'sentAt',
                sortDir: 'desc'
            });
            setMessages(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load messages');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchParams]);

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

    const handleDeleteMessage = async (messageId: string) => {
        if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            return;
        }

        setDeletingId(messageId);
        try {
            await messageService.deleteMessage(messageId);
            toast.success('Message deleted successfully');
            await loadData();
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete message');
            toast.error(getErrorMessage(apiError));
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">Loading messages...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-5">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Customer Messages</h1>
                <p className="text-gray-600 mt-2">View and manage customer inquiries</p>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 mb-4">
                        <Mail className="w-16 h-16 mx-auto flex-shrink-0" strokeWidth={1.5}/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Messages Yet</h3>
                    <p className="text-gray-500">Customer messages will appear here</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Message ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Content
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sent At
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map((message) => (
                                <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                        {message.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                        <div className="line-clamp-2">
                                            {message.content}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                                <span className="font-medium">{message.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                                <span className="text-xs">{message.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                            <span>{formatDate(message.sentAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDeleteMessage(message.id)}
                                            disabled={deletingId === message.id}
                                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4 flex-shrink-0"/>
                                            {deletingId === message.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {messages.length > 0 && (
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

export default DashboardMessages;