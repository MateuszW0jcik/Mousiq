import React, {useEffect, useState} from 'react';
import orderService from "../../services/order.service.ts";
import Pagination from "../../components/Pagination.jsx";
import OrderDetailsModal from "../../components/OrderDetailsModal.jsx";
import {useSearchParams} from "react-router-dom";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {toast} from 'react-toastify';
import {type Order, type OrderSummary} from "../../types/order.types.js";
import {getOrderStatusLabel, getOrderStatusColor} from "../../utils/order.utils.js";

const AccountOrders: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const currentPage = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await orderService.getUserOrders({
                    page: currentPage - 1,
                    size: 10,
                    sortBy: 'createdAt',
                    sortDir: 'desc'
                });
                setOrders(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to fetch orders');
                toast.error(getErrorMessage(apiError));
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage]);

    const fetchOrderDetails = async (orderId: string) => {
        setLoadingDetails(true);
        try {
            const details = await orderService.getUserOrderDetails(orderId);
            setSelectedOrder(details);
            setModalOpen(true);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to fetch order details');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to fetch order details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClasses = (color: string): string => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        const colorClasses: Record<string, string> = {
            'orange': 'bg-orange-100 text-orange-700',
            'blue': 'bg-blue-100 text-blue-700',
            'purple': 'bg-purple-100 text-purple-700',
            'green': 'bg-green-100 text-green-700',
            'red': 'bg-red-100 text-red-700',
            'yellow': 'bg-yellow-100 text-yellow-700',
        };
        return `${baseClasses} ${colorClasses[color] || 'bg-gray-100 text-gray-700'}`;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage.toString());
        setSearchParams(newParams);
        window.scrollTo(0, 0);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-5">
            <div className="mb-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Order History</h3>
                <p className="text-sm text-gray-600">View and track all your orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h4>
                    <p className="text-sm text-gray-600 mb-4">You haven't placed any orders yet. Start shopping for your
                        perfect gaming mouse!</p>
                    <a
                        href="/products"
                        className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Browse Products
                    </a>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Placed On
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <span className="font-mono text-xs">
                                                {order.id.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            ${order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={getStatusBadgeClasses(getOrderStatusColor(order.status))}>
                                                {getOrderStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => fetchOrderDetails(order.id)}
                                                disabled={loadingDetails}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {loadingDetails ? 'Loading...' : 'Details'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-6"
                    />
                </>
            )}

            <OrderDetailsModal
                isOpen={modalOpen}
                onClose={closeModal}
                orderDetails={selectedOrder}
                loading={loadingDetails}
            />
        </div>
    );
};

export default AccountOrders;