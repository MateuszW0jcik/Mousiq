import React, {useState} from 'react';
import {X} from 'lucide-react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {paymentMethodService} from '../services/payment-method.service';
import type {PaymentMethodRequest} from '../types/payment-method.types.ts';
import {parseApiError, isValidationError} from "../services/api.service";

const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY);

interface AddPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void;
    userEmail: string;
}

interface FormData {
    cardHolderName: string;
    isDefault: boolean;
}

interface ValidationErrors {
    cardHolderName?: string;
    card?: string;
}

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#1f2937',
            '::placeholder': {
                color: '#9ca3af',
            },
            fontFamily: 'system-ui, -apple-system, sans-serif',
        },
        invalid: {
            color: '#ef4444',
            iconColor: '#ef4444',
        },
    },
    hidePostalCode: true,
};

const AddPaymentForm: React.FC<Omit<AddPaymentModalProps, 'isOpen'>> = ({
                                                                            onClose,
                                                                            onAdd,
                                                                            userEmail
                                                                        }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState<FormData>({
        cardHolderName: '',
        isDefault: false
    });

    const handleInputChange = (name: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    const validateForm = (): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!formData.cardHolderName.trim()) {
            errors.cardHolderName = 'Cardholder name is required';
        } else if (formData.cardHolderName.trim().length < 3) {
            errors.cardHolderName = 'Cardholder name must be at least 3 characters';
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setValidationErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setIsLoading(false);
            return;
        }

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const {paymentMethod, error} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: formData.cardHolderName,
                    email: userEmail,
                },
            });

            if (error) {
                setValidationErrors({card: error.message});
                setIsLoading(false);
                return;
            }

            if (!paymentMethod) {
                throw new Error('Failed to create payment method');
            }

            const paymentData: PaymentMethodRequest = {
                stripePaymentMethodId: paymentMethod.id,
                cardHolderName: formData.cardHolderName,
                userEmail: userEmail,
                isDefault: formData.isDefault
            };

            await paymentMethodService.addPaymentMethod(paymentData);
            onAdd();
            onClose();
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to add payment method');

            if (isValidationError(apiError)) {
                setValidationErrors(apiError.errors);
                setErrorMessage('Please fix the errors below');
            } else {
                setErrorMessage(apiError.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                {/* Cardholder Name */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-600">
                        Cardholder Name
                    </label>
                    <input
                        type="text"
                        value={formData.cardHolderName}
                        onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                            validationErrors.cardHolderName ? 'border-red-500' : 'border-gray-200'
                        } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="John Doe"
                        disabled={isLoading}
                    />
                    {validationErrors.cardHolderName && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.cardHolderName}</p>
                    )}
                </div>

                {/* Stripe Card Element */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-600">
                        Card Information
                    </label>
                    <div className={`w-full px-4 py-3 border ${
                        validationErrors.card ? 'border-red-500' : 'border-gray-200'
                    } rounded focus-within:ring-2 focus-within:ring-blue-500`}>
                        <CardElement options={CARD_ELEMENT_OPTIONS}/>
                    </div>
                    {validationErrors.card && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.card}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Your card information is securely processed by Stripe
                    </p>
                </div>

                {/* Set as Default */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">
                        Set as default payment method
                    </label>
                </div>

                {/* Global error message */}
                {errorMessage && (
                    <div className="text-sm border border-red-300 text-red-700 bg-red-100 p-3 rounded">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
};

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onAdd,
                                                             userEmail
                                                         }) => {
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Add Payment Method</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 cursor-pointer"/>
                    </button>
                </div>

                {/* Stripe Elements Provider */}
                <Elements stripe={stripePromise}>
                    <AddPaymentForm onClose={onClose} onAdd={onAdd} userEmail={userEmail}/>
                </Elements>
            </div>
        </div>
    );
};

export default AddPaymentModal;