import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Header from "../../../../components/Header";
import PaymentImage from "../../../../assets/cart-path/payment.png";
import {MapPin, Plus, SquarePen, Star, Trash2} from "lucide-react";
import ProductInCheckout from "../../../../components/ProductInCheckout";
import DynamicModal, {type Field} from "../../../../components/DynamicModal";
import Footer from "../../../../components/Footer";
import {useCart} from "../../../../contexts/CartContext";
import {useAuth} from "../../../../contexts/AuthContext";
import addressService from "../../../../services/address.service";
import paymentMethodService from "../../../../services/payment-method.service";
import AddPaymentModal from "../../../../components/AddPaymentModal";
import orderService from "../../../../services/order.service";
import {toast} from "react-toastify";
import {parseApiError, getErrorMessage} from "../../../../services/api.service";
import {type Address} from "../../../../types/address.types";
import {type PaymentMethod} from "../../../../types/payment-method.types";
import {type Contact} from "../../../../types/contact.types";
import {type ShippingMethod} from "../../../../types/shipping-method.types";

interface CheckoutData {
    shipping_address_id: string;
    contact_id: string;
    shipping_method_id: string;
    shipping_cost: number;
    subTotal: number;
    tax: number;
    grandTotal: number;
    selected_address?: Address;
    selected_contact?: Contact;
    selected_shipping_method?: ShippingMethod;
}

interface ModalState {
    isOpen: boolean;
    type: 'address' | '';
    title: string;
    fields: Field[];
    initialData: Record<string, string>;
    editId: string | null;
}

const Payment: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuth();
    const checkoutData = location.state as CheckoutData | null;
    const {cartItems, fetchCart} = useCart();

    const [payments, setPayments] = useState<PaymentMethod[]>([]);
    const [billingAddresses, setBillingAddresses] = useState<Address[]>([]);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
    const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {},
        editId: null
    });

    useEffect(() => {
        if (!checkoutData || !checkoutData.shipping_address_id || !checkoutData.contact_id || !checkoutData.shipping_method_id) {
            navigate('/cart/checkout', {replace: true});
        }
    }, [checkoutData, navigate]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [addressesData, paymentsData] = await Promise.all([
                addressService.getUserAddresses(),
                paymentMethodService.getUserPaymentMethods(),
            ]);
            setBillingAddresses(addressesData || []);
            setPayments(paymentsData || []);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load payment data');
            toast.error(getErrorMessage(apiError));
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-select default payment method
        const defaultPayment = payments.find(p => p.default);
        if (defaultPayment && !selectedPaymentId) {
            setSelectedPaymentId(defaultPayment.id);
        } else if (payments.length > 0 && !selectedPaymentId) {
            setSelectedPaymentId(payments[0].id);
        }

        // Auto-select shipping address as billing (or first available)
        if (billingAddresses.length > 0 && !selectedBillingAddressId) {
            const shippingAddress = billingAddresses.find(a => a.id === checkoutData?.shipping_address_id);
            setSelectedBillingAddressId(shippingAddress?.id || billingAddresses[0].id);
        }
    }, [billingAddresses, payments, selectedBillingAddressId, selectedPaymentId, checkoutData]);

    const closeModal = () => {
        setModal({
            isOpen: false,
            type: '',
            title: '',
            fields: [],
            initialData: {},
            editId: null
        });
    };

    const openAddressModal = (address: Address | null = null) => {
        setModal({
            isOpen: true,
            type: 'address',
            title: address ? 'Edit Address' : 'Add New Address',
            fields: [
                {name: 'street', label: 'Street', type: 'text', placeholder: 'Enter street name', required: true},
                {
                    name: 'streetNumber',
                    label: 'Street Number',
                    type: 'text',
                    placeholder: 'Enter street number',
                    required: true
                },
                {
                    name: 'postalCode',
                    label: 'Postal Code',
                    type: 'text',
                    placeholder: 'Enter postal code',
                    required: true
                },
                {name: 'city', label: 'City', type: 'text', placeholder: 'Enter city', required: true},
                {name: 'country', label: 'Country', type: 'text', placeholder: 'Enter country', required: true}
            ],
            initialData: address ? {
                street: address.street,
                streetNumber: address.streetNumber || '',
                postalCode: address.postalCode,
                city: address.city,
                country: address.country
            } : {},
            editId: address?.id || null
        });
    };

    const handleSave = async (formData: Record<string, unknown>) => {
        try {
            if (modal.type === 'address') {
                if (modal.editId) {
                    await addressService.editAddress(modal.editId, {
                        street: formData.street as string,
                        streetNumber: formData.streetNumber as string,
                        postalCode: formData.postalCode as string,
                        city: formData.city as string,
                        country: formData.country as string
                    });
                    toast.success('Address updated successfully');
                } else {
                    await addressService.addAddress({
                        street: formData.street as string,
                        streetNumber: formData.streetNumber as string,
                        postalCode: formData.postalCode as string,
                        city: formData.city as string,
                        country: formData.country as string
                    });
                    toast.success('Address added successfully');
                }
                await loadData();
            }
        } catch (error) {
            const apiError = parseApiError(error, `Failed to ${modal.editId ? 'update' : 'add'} address`);
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            if (modal.type === 'address' && modal.editId) {
                await addressService.deleteAddress(modal.editId);
                if (selectedBillingAddressId === modal.editId) {
                    setSelectedBillingAddressId(null);
                }
                toast.success('Address deleted successfully');
                await loadData();
            }
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete address');
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    const handleDeletePayment = async (paymentId: string) => {
        if (!window.confirm('Are you sure you want to delete this payment method?')) {
            return;
        }

        try {
            setDeletingId(paymentId);
            await paymentMethodService.deletePaymentMethod(paymentId);
            if (selectedPaymentId === paymentId) {
                setSelectedPaymentId(null);
            }
            await loadData();
            toast.success('Payment method deleted successfully');
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete payment method');
            toast.error(getErrorMessage(apiError));
        } finally {
            setDeletingId(null);
        }
    };

    const handleAddPaymentSuccess = async () => {
        await loadData();
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

    const canFinalizePayment = (): boolean => {
        return !!(
            selectedBillingAddressId &&
            selectedPaymentId &&
            cartItems.length > 0 &&
            checkoutData &&
            checkoutData.shipping_address_id &&
            checkoutData.contact_id &&
            checkoutData.shipping_method_id
        );
    };

    const handleFinalizePayment = async () => {
        if (!checkoutData || !selectedPaymentId) return;

        setIsPlacingOrder(true);
        try {
            await orderService.createOrder({
                addressId: checkoutData.shipping_address_id,
                contactId: checkoutData.contact_id,
                paymentMethodId: selectedPaymentId,
                shippingMethodId: checkoutData.shipping_method_id,
            });

            await fetchCart();
            toast.success('Order placed successfully! Thank you for shopping at Mousiq.');
            navigate('/account/orders');
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to create order');
            toast.error(getErrorMessage(apiError));
            console.error('Order creation failed:', error);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (!checkoutData) {
        return null;
    }

    if (loading) {
        return (
            <>
                <Header/>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <div className="ml-4 text-lg">Loading...</div>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header/>

            <div className="max-w-5xl mx-auto p-5 flex justify-center">
                <div className="w-full">
                    <div className="my-8 mb-12">
                        <img
                            src={PaymentImage}
                            alt="Payment steps"
                            className="select-none mx-auto"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5 relative">
                        <div
                            className="lg:col-span-2 rounded-2xl p-6 box-border border border-gray-200 space-y-8 h-fit">

                            {/* Payment Method Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>

                                {payments.length === 0 ? (
                                    <div
                                        className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <p className="text-gray-600 mb-4">No payment methods found</p>
                                        <button
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4"/>
                                            Add Payment Method
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {payments.map((payment) => (
                                                <div key={payment.id}>
                                                    <label className="cursor-pointer">
                                                        <div
                                                            className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                                                                selectedPaymentId === payment.id
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name="payment_method"
                                                                value={payment.id}
                                                                checked={selectedPaymentId === payment.id}
                                                                onChange={() => setSelectedPaymentId(payment.id)}
                                                                className="mr-3 w-4 h-4 text-blue-600 cursor-pointer"
                                                            />
                                                            <img
                                                                className="h-8 w-auto mr-3"
                                                                src={getCardBrandIcon(payment.cardBrand)}
                                                                alt={payment.cardBrand}
                                                            />
                                                            <div className="flex-grow">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium text-gray-800">
                                                                        {formatCardBrand(payment.cardBrand)} •••• {payment.cardLastFourDigits}
                                                                    </p>
                                                                    {payment.default && (
                                                                        <span
                                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            <Star className="w-3 h-3 fill-current"/>
                                                                            Default
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600">
                                                                    {payment.cardHolderName}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    Expires {payment.expiryMonth}/{payment.expiryYear}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeletePayment(payment.id);
                                                                    }}
                                                                    disabled={deletingId === payment.id}
                                                                    className="p-1 hover:scale-110 transition-transform text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer"
                                                                >
                                                                    <Trash2 className="w-5 h-5"/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setIsAddModalOpen(true)}
                                            className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4"/>
                                            Add Payment Method
                                        </button>
                                    </>
                                )}
                            </div>

                            <AddPaymentModal
                                isOpen={isAddModalOpen}
                                onClose={() => setIsAddModalOpen(false)}
                                onAdd={handleAddPaymentSuccess}
                                userEmail={user?.email || checkoutData.selected_contact?.email || ''}
                            />

                            {/* Billing Address Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
                                <div className="space-y-3">
                                    {billingAddresses.map((address) => (
                                        <label key={address.id} className="cursor-pointer">
                                            <div className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                                                selectedBillingAddressId === address.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="billing_address"
                                                    value={address.id}
                                                    checked={selectedBillingAddressId === address.id}
                                                    onChange={() => setSelectedBillingAddressId(address.id)}
                                                    className="mr-3 w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <MapPin className="w-5 h-5 mr-3 text-gray-400"/>
                                                <p className="text-gray-800 text-sm flex-grow">
                                                    {address.street} {address.streetNumber}, {address.postalCode} {address.city}, {address.country}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openAddressModal(address);
                                                    }}
                                                    className="p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800 cursor-pointer"
                                                >
                                                    <SquarePen className="w-5 h-5 cursor-pointer"></SquarePen>
                                                </button>
                                            </div>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => openAddressModal()}
                                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        Add Address
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link
                                    to="/cart/checkout"
                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                    ← Return to Checkout
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div
                            className="rounded-2xl p-4 pb-5 h-fit w-full lg:min-w-[400px] box-border border border-gray-200 shadow-sm">
                            <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>

                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No products in cart</p>
                            ) : (
                                cartItems.map((item) => (
                                    <ProductInCheckout
                                        key={item.id}
                                        item={item}
                                        loading={loading}
                                    />
                                ))
                            )}

                            <div className="pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${checkoutData.subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${checkoutData.shipping_cost.toFixed(2)}</span>
                                </div>
                                <hr className="my-4 border-gray-200"/>
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-blue-600">${checkoutData.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                {canFinalizePayment() ? (
                                    <button
                                        onClick={handleFinalizePayment}
                                        disabled={isPlacingOrder}
                                        className="block w-full bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-pointer transition-transform hover:scale-105 text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="block w-full bg-gray-400 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-not-allowed text-center"
                                        title="Please select payment method and billing address"
                                    >
                                        Place Order
                                    </button>
                                )}
                            </div>

                            {!canFinalizePayment() && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    Please select payment method and billing address
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DynamicModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                fields={modal.fields}
                initialData={modal.initialData}
                onSave={handleSave}
                onDelete={handleDelete}
                showDelete={modal.editId !== null}
            />

            <Footer/>
        </>
    );
};

export default Payment;