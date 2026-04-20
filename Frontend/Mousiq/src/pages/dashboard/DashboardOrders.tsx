import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import orderService from "../../services/order.service.ts";
import Pagination from "../../components/Pagination.jsx";
import OrderDetailsModal from "../../components/OrderDetailsModal.jsx";
import {Search, Package, DollarSign, User, Calendar, RefreshCw} from 'lucide-react';
import {toast} from "react-toastify";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {type OrderSummary, type Order, OrderStatus} from "../../types/order.types.js";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select";
import {getOrderStatusColor} from "../../utils/order.utils.ts";

const DashboardOrders: React.FC = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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
                const response = await orderService.getAllOrders({
                    page: currentPage - 1,
                    size: 10,
                    sortBy: 'createdAt',
                    sortDir: 'desc',
                    ownerName: debouncedSearchTerm
                });
                setOrders(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to load orders');
                toast.error(getErrorMessage(apiError));
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [debouncedSearchTerm, searchParams]);

    const fetchOrderDetails = async (orderId: string) => {
        setLoadingDetails(true);
        try {
            const details = await orderService.getOrderDetailsAdmin(orderId);
            setSelectedOrder(details);
            setModalOpen(true);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load order details');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to fetch order details:', error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(orderId);
        try {
            await orderService.updateOrderStatus(orderId, {status: newStatus as keyof typeof OrderStatus});
            toast.success('Order status updated successfully');

            const response = await orderService.getAllOrders({
                page: currentPage - 1,
                size: 10,
                sortBy: 'createdAt',
                sortDir: 'desc',
                ownerName: debouncedSearchTerm
            });
            setOrders(response.content);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to update order status');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to update order status:', error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const getStatusBadgeColor = (color: string): string => {
        const colorClasses: Record<string, string> = {
            'orange': 'bg-orange-100 text-orange-700',
            'blue': 'bg-blue-100 text-blue-700',
            'purple': 'bg-purple-100 text-purple-700',
            'green': 'bg-green-100 text-green-700',
            'red': 'bg-red-100 text-red-700',
            'yellow': 'bg-yellow-100 text-yellow-700',
        };
        return colorClasses[color] || 'bg-gray-100 text-gray-700';
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

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(newPage));
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
                <div className="ml-4 text-lg">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-5">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-2">View and manage customer orders</p>
            </div>

            <div className="flex items-center w-full border border-gray-300 rounded-lg px-3 py-2 bg-white mb-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <Search className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0"/>
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search orders by customer name..."
                    autoComplete="off"
                    className="flex-1 outline-none bg-transparent text-sm"
                />
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 mb-4">
                        <Package className="w-16 h-16 mx-auto" strokeWidth={1.5}/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'Try a different search term' : 'Customer orders will appear here'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Placed On
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                        {order.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0"/>
                                            <span className="font-semibold text-green-700">
                                                {order.totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                            <span className="font-medium break-words">{order.owner}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={order.status}
                                                onValueChange={(value) => handleStatusChange(order.id, value)}
                                                disabled={updatingStatus === order.id}
                                            >
                                                <SelectTrigger
                                                    className={`w-auto h-auto px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(getOrderStatusColor(order.status))} hover:shadow-md transition-all`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(OrderStatus).map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {updatingStatus === order.id && (
                                                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0"/>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => fetchOrderDetails(order.id)}
                                            disabled={loadingDetails}
                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                                        >
                                            <Package className="w-4 h-4 flex-shrink-0"/>
                                            {loadingDetails ? 'Loading...' : 'View Details'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {orders.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-6"
                />
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

export default DashboardOrders;