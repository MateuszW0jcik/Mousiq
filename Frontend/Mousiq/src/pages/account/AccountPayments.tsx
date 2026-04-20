import React, {useEffect, useState} from 'react';
import paymentMethodService from "../../services/payment-method.service";
import AddPaymentModal from "../../components/AddPaymentModal";
import {Plus, Trash2, Star} from "lucide-react";
import {parseApiError, getErrorMessage} from "../../services/api.service";
import {toast} from 'react-toastify';
import {type PaymentMethod} from "../../types/payment-method.types.ts";
import {useAuth} from "../../contexts/AuthContext";

const AccountPayments: React.FC = () => {
    const {user} = useAuth();
    const [payments, setPayments] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            setIsLoading(true);
            const data = await paymentMethodService.getUserPaymentMethods();
            setPayments(data);
            console.log(data);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load payment methods');
            toast.error(getErrorMessage(apiError));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetDefault = async (paymentId: string) => {
        try {
            setSettingDefaultId(paymentId);
            await paymentMethodService.setDefaultPaymentMethod(paymentId);
            await loadPayments();
            toast.success('Default payment method updated');
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to set default payment method');
            toast.error(getErrorMessage(apiError));
        } finally {
            setSettingDefaultId(null);
        }
    };

    const handleDelete = async (paymentId: string) => {
        if (!window.confirm('Are you sure you want to delete this payment method?')) {
            return;
        }

        try {
            setDeletingId(paymentId);
            await paymentMethodService.deletePaymentMethod(paymentId);
            await loadPayments();
            toast.success('Payment method deleted successfully');
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete payment method');
            toast.error(getErrorMessage(apiError));
        } finally {
            setDeletingId(null);
        }
    };

    const handleAddPaymentSuccess = async () => {
        await loadPayments();
        toast.success('Payment method added successfully');
    };

    const getCardBrandIcon = (brand: string): string => {
        const brandLower = brand.toLowerCase();
        switch (brandLower) {
            case 'visa':
                return '/src/assets/payments/visa.png';
            case 'mastercard':
                return '/src/assets/payments/mastercard.png';
            case 'amex':
                return '/src/assets/payments/amex.png';
            default:
                return '/src/assets/payments/card.png';
        }
    };

    const formatCardBrand = (brand: string): string => {
        const brands: Record<string, string> = {
            'visa': 'Visa',
            'mastercard': 'Mastercard',
            'amex': 'American Express',
            'discover': 'Discover',
            'diners': 'Diners Club',
            'jcb': 'JCB',
            'unionpay': 'UnionPay'
        };
        return brands[brand.toLowerCase()] || brand;
    };

    if (isLoading) {
        return (
            <div className="w-full max-w-5xl p-5 font-sans">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-5">
            <div className="mb-5 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Methods</h3>
                    <p className="text-sm text-gray-600">Manage your payment methods for quick checkout</p>
                </div>
                {payments.length > 0 && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mt-3 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4"/>
                        Add Card
                    </button>
                )}
            </div>

            {payments.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                        </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">No Payment Methods</h4>
                    <p className="text-sm text-gray-600 mb-4">Add a payment method to speed up your checkout process</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4"/>
                        Add Payment Method
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Card
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cardholder
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expires
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                className="h-8 w-auto mr-3"
                                                src={getCardBrandIcon(payment.cardBrand)}
                                                alt={payment.cardBrand}
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCardBrand(payment.cardBrand)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    •••• {payment.cardLastFourDigits}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.cardHolderName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {payment.expiryMonth}/{payment.expiryYear}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.default ? (
                                            <span
                                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <Star className="w-3 h-3 fill-current"/>
                                                    Default
                                                </span>
                                        ) : (
                                            <button
                                                onClick={() => handleSetDefault(payment.id)}
                                                disabled={settingDefaultId === payment.id}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer disabled:opacity-50"
                                            >
                                                {settingDefaultId === payment.id ? 'Setting...' : 'Set as default'}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(payment.id)}
                                            disabled={deletingId === payment.id}
                                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4 flex-shrink-0"/>
                                            {deletingId === payment.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <AddPaymentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddPaymentSuccess}
                userEmail={user?.email || ''}
            />
        </div>
    );
};

export default AccountPayments;