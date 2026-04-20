import React, {useEffect, useState} from 'react';
import Header from "../../../components/Header.jsx";
import Footer from "../../../components/Footer.jsx";
import {useCart} from "../../../contexts/CartContext.jsx";
import CheckoutImage from "../../../assets/cart-path/checkout.png";
import {Link, useNavigate} from "react-router-dom";
import ProductInCheckout from "../../../components/ProductInCheckout.jsx";
import {Mail, MapPin, Plus, User, Truck, SquarePen} from "lucide-react";
import {useAuth} from "../../../contexts/AuthContext.jsx";
import addressService from "../../../services/address.service.ts";
import contactService from "../../../services/contact.service.ts";
import DynamicModal, {type Field} from "../../../components/DynamicModal.jsx";
import shippingMethodService from "../../../services/shipping-method.service.ts";
import {parseApiError, getErrorMessage} from "../../../services/api.service.js";
import {toast} from 'react-toastify';
import {type Address} from "../../../types/address.types.js";
import {type Contact} from "../../../types/contact.types.js";
import {type ShippingMethod} from "../../../types/shipping-method.types.js";

interface ModalState {
    isOpen: boolean;
    type: 'address' | 'contact' | '';
    title: string;
    fields: Field[];
    initialData: Record<string, string>;
    editId: string | null;
}

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {cartItems, subTotal} = useCart();
    const {user} = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | null>(null);

    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {},
        editId: null
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [addressesData, contactsData, shippingData] = await Promise.all([
                addressService.getUserAddresses(),
                contactService.getUserContacts(),
                shippingMethodService.getAllShippingMethods(),
            ]);
            setAddresses(addressesData || []);
            setContacts(contactsData || []);
            setShippingMethods(shippingData || []);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load checkout data');
            toast.error(getErrorMessage(apiError));
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].id);
        }
        if (contacts.length > 0 && !selectedContactId) {
            setSelectedContactId(contacts[0].id);
        }
        if (shippingMethods.length > 0 && !selectedShippingMethodId) {
            setSelectedShippingMethodId(shippingMethods[0].id);
        }
    }, [addresses, contacts, shippingMethods, selectedAddressId, selectedContactId, selectedShippingMethodId]);

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
                streetNumber: address.streetNumber,
                postalCode: address.postalCode,
                city: address.city,
                country: address.country
            } : {},
            editId: address?.id || null
        });
    };

    const openContactModal = (contact: Contact | null = null) => {
        setModal({
            isOpen: true,
            type: 'contact',
            title: contact ? 'Edit Contact' : 'Add New Contact',
            fields: [
                {name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email address', required: true},
                {
                    name: 'phoneNumber',
                    label: 'Phone Number',
                    type: 'text',
                    placeholder: 'Enter phone number',
                    required: true
                }
            ],
            initialData: contact ? {
                email: contact.email,
                phoneNumber: contact.phoneNumber
            } : {},
            editId: contact?.id || null
        });
    };

    const handleSave = async (formData: Record<string, unknown>) => {
        try {
            switch (modal.type) {
                case 'address':
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
                    break;

                case 'contact':
                    if (modal.editId) {
                        await contactService.editContact(modal.editId, {
                            email: formData.email as string,
                            phoneNumber: formData.phoneNumber as string
                        });
                        toast.success('Contact updated successfully');
                    } else {
                        await contactService.addContact({
                            email: formData.email as string,
                            phoneNumber: formData.phoneNumber as string
                        });
                        toast.success('Contact added successfully');
                    }
                    await loadData();
                    break;
            }
        } catch (error) {
            const apiError = parseApiError(error, `Failed to ${modal.editId ? 'update' : 'add'} ${modal.type}`);
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            switch (modal.type) {
                case 'address':
                    if (modal.editId) {
                        await addressService.deleteAddress(modal.editId);
                        if (selectedAddressId === modal.editId) {
                            setSelectedAddressId(null);
                        }
                        toast.success('Address deleted successfully');
                        await loadData();
                    }
                    break;

                case 'contact':
                    if (modal.editId) {
                        await contactService.deleteContact(modal.editId);
                        if (selectedContactId === modal.editId) {
                            setSelectedContactId(null);
                        }
                        toast.success('Contact deleted successfully');
                        await loadData();
                    }
                    break;
            }
        } catch (error) {
            const apiError = parseApiError(error, `Failed to delete ${modal.type}`);
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    const getShippingCost = (): number => {
        const method = shippingMethods.find(m => m.id === selectedShippingMethodId);
        return method ? method.price : 0;
    };

    const getGrandTotal = (): number => {
        return subTotal + getShippingCost();
    };

    const canProceedToPayment = (): boolean => {
        return !!(selectedAddressId && selectedContactId && cartItems.length > 0 && selectedShippingMethodId);
    };

    const handleProceedToPayment = () => {
        const checkoutData = {
            shipping_address_id: selectedAddressId,
            contact_id: selectedContactId,
            shipping_method_id: selectedShippingMethodId,
            shipping_cost: getShippingCost(),
            subTotal: subTotal,
            grandTotal: getGrandTotal(),
            selected_address: addresses.find(addr => addr.id === selectedAddressId),
            selected_contact: contacts.find(contact => contact.id === selectedContactId),
            selected_shipping_method: shippingMethods.find(method => method.id === selectedShippingMethodId)
        };

        navigate('/cart/checkout/payment', {
            state: checkoutData
        });
    };

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
                            src={CheckoutImage}
                            alt="Checkout steps"
                            className="select-none mx-auto"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5 relative">
                        <div
                            className="lg:col-span-2 rounded-2xl p-6 box-border border border-gray-200 space-y-8 h-fit">
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Full Name</h3>
                                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                                    <User className="w-6 h-6 mr-3 text-gray-400"/>
                                    <p className="text-gray-800 flex-grow">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <label key={address.id} className="cursor-pointer">
                                            <div
                                                className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                    selectedAddressId === address.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="shipping_address"
                                                    value={address.id}
                                                    checked={selectedAddressId === address.id}
                                                    onChange={() => setSelectedAddressId(address.id)}
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

                            <div>
                                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    {contacts.map((contact) => (
                                        <label key={contact.id} className="cursor-pointer">
                                            <div
                                                className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                    selectedContactId === contact.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="contact"
                                                    value={contact.id}
                                                    checked={selectedContactId === contact.id}
                                                    onChange={() => setSelectedContactId(contact.id)}
                                                    className="mr-3 w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <Mail className="w-5 h-5 mr-3 text-gray-400"/>
                                                <p className="text-gray-800 text-sm flex-grow">
                                                    {contact.email}, {contact.phoneNumber}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openContactModal(contact);
                                                    }}
                                                    className="cursor-pointer p-1 hover:scale-110 transition-transform text-blue-600 hover:text-blue-800"
                                                >
                                                    <SquarePen className="w-5 h-5 cursor-pointer"></SquarePen>
                                                </button>
                                            </div>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => openContactModal()}
                                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4"/>
                                        Add Contact
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4">Shipping Method</h3>
                                <div className="space-y-3">
                                    {shippingMethods.map((method) => (
                                        <label key={method.id} className="cursor-pointer">
                                            <div
                                                className={`flex items-center p-4 rounded-lg border-2 transition-all mb-4 ${
                                                    selectedShippingMethodId === method.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="shipping_method"
                                                    value={method.id}
                                                    checked={selectedShippingMethodId === method.id}
                                                    onChange={() => setSelectedShippingMethodId(method.id)}
                                                    className="mr-3 w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <Truck className="w-5 h-5 mr-3 text-gray-400"/>
                                                <div className="flex-grow">
                                                    <p className="text-gray-800 font-medium">{method.name}</p>
                                                    <p className="text-gray-600 text-sm">
                                                        {method.description}
                                                        <span className="font-semibold ml-2">
                                                            ${method.price.toFixed(2)}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link
                                    to="/cart"
                                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                >
                                    ← Return to Cart
                                </Link>
                            </div>
                        </div>

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
                                    <span className="font-medium">${subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${getShippingCost().toFixed(2)}</span>
                                </div>
                                <hr className="my-4 border-gray-200"/>
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-blue-600">${getGrandTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                {canProceedToPayment() ? (
                                    <button
                                        onClick={handleProceedToPayment}
                                        className="block w-full bg-blue-600 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-pointer transition-transform hover:scale-105 text-center"
                                    >
                                        Proceed to Payment
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="block w-full bg-gray-400 text-white border-none rounded-lg px-6 py-3 text-base font-bold cursor-not-allowed text-center"
                                        title="Please select shipping address, contact, and shipping method"
                                    >
                                        Proceed to Payment
                                    </button>
                                )}
                            </div>

                            {!canProceedToPayment() && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    Please complete all required fields
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
                showDelete={modal.editId !== null && (modal.type === 'address' || modal.type === 'contact')}
            />

            <Footer/>
        </>
    );
};

export default Checkout;