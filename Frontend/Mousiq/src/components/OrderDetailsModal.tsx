import React, {useState} from 'react';
import {X, ShoppingBag, MapPin, Mail, Phone, Package} from 'lucide-react';
import type {Order} from '../types/order.types';
import {getOrderStatusColor} from "../utils/order.utils.ts";

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderDetails: Order | null;
    loading: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({isOpen, onClose, orderDetails, loading}) => {
    const [clickedOnOverlay, setClickedOnOverlay] = useState(false);

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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                        {orderDetails && (
                            <p className="text-sm text-gray-500 mt-1">Order placed on {formatDate(orderDetails.createdAt)}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 cursor-pointer"/>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : orderDetails ? (
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-5 h-5 text-blue-600"/>
                                        <span className="text-sm font-medium text-gray-600">Status</span>
                                    </div>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(getOrderStatusColor(orderDetails.status))}`}>
                                        {orderDetails.status}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShoppingBag className="w-5 h-5 text-purple-600"/>
                                        <span className="text-sm font-medium text-gray-600">Total Amount</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">${orderDetails.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Contact & Delivery Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Contact Information */}
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"/>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Email</p>
                                                <p className="text-sm text-gray-900 break-words">{orderDetails.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"/>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                <p className="text-sm text-gray-900">{orderDetails.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-5 h-5 text-gray-700"/>
                                        <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-900 font-medium">
                                            {orderDetails.street} {orderDetails.streetNumber}
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {orderDetails.postalCode} {orderDetails.city}
                                        </p>
                                        <p className="text-sm text-gray-900 font-medium">{orderDetails.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ordered Items */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-gray-700"/>
                                        <h3 className="text-lg font-semibold text-gray-900">Ordered Items</h3>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {orderDetails.orderedItems.length} {orderDetails.orderedItems.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {orderDetails.orderedItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white"
                                        >
                                            <img
                                                src={item.productImageUrl || 'https://dummyimage.com/120x120/ffffff/000000.png&text=No+Image'}
                                                alt={item.productName}
                                                className="w-24 h-24 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                                                loading="lazy"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                    {item.productName}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">{item.brandName}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-lg font-bold text-gray-900">
                                                            ${item.price.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            Quantity: {item.quantity}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-blue-600">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Order Total</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${orderDetails.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">No order details available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;