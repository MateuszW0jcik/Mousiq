import React, {useState, useEffect} from 'react';
import {User, Key, MapPin, Mail, Plus, SquarePen} from 'lucide-react';
import DynamicModal, {type Field} from '../../components/DynamicModal.jsx';
import {useAuth} from "../../contexts/AuthContext.jsx";
import userService from "../../services/user.service.ts";
import addressService from "../../services/address.service.ts";
import contactService from "../../services/contact.service.ts";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {toast} from 'react-toastify';
import {type Address} from "../../types/address.types.js";
import {type Contact} from "../../types/contact.types.js";

interface ModalState {
    isOpen: boolean;
    type: 'name' | 'password' | 'address' | 'contact' | '';
    title: string;
    fields: Field[];
    initialData: Record<string, string>;
    editId: string | null;
}

const AccountPersonalData: React.FC = () => {
    const {user, refreshUser} = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(true);
        try {
            const [addressesData, contactsData] = await Promise.all([
                addressService.getUserAddresses(),
                contactService.getUserContacts()
            ]);
            setAddresses(addressesData || []);
            setContacts(contactsData || []);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load personal data');
            toast.error(getErrorMessage(apiError));
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const openNameModal = () => {
        setModal({
            isOpen: true,
            type: 'name',
            title: 'Edit Full Name',
            fields: [
                {
                    name: 'firstName',
                    label: 'First Name',
                    type: 'text',
                    placeholder: 'Enter your first name',
                    required: true
                },
                {
                    name: 'lastName',
                    label: 'Last Name',
                    type: 'text',
                    placeholder: 'Enter your last name',
                    required: true
                }
            ],
            initialData: {firstName: user?.firstName || '', lastName: user?.lastName || ''},
            editId: null
        });
    };

    const openPasswordModal = () => {
        setModal({
            isOpen: true,
            type: 'password',
            title: 'Change Password',
            fields: [
                {
                    name: 'oldPassword',
                    label: 'Current Password',
                    type: 'password',
                    placeholder: 'Enter current password',
                    required: true
                },
                {
                    name: 'newPassword',
                    label: 'New Password',
                    type: 'password',
                    placeholder: 'Enter new password',
                    required: true
                },
                {
                    name: 'repeatedPassword',
                    label: 'Confirm New Password',
                    type: 'password',
                    placeholder: 'Re-enter new password',
                    required: true
                }
            ],
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
                case 'name':
                    await userService.updateFullName({
                        firstName: formData.firstName as string,
                        lastName: formData.lastName as string
                    });
                    await refreshUser();
                    toast.success('Name updated successfully');
                    break;

                case 'password':
                    if (formData.newPassword !== formData.repeatedPassword) {
                        toast.error('Passwords do not match');
                        return;
                    }
                    await userService.changePassword({
                        oldPassword: formData.oldPassword as string,
                        newPassword: formData.newPassword as string,
                        repeatedPassword: formData.repeatedPassword as string
                    });
                    toast.success('Password changed successfully');
                    break;

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
                        toast.success('Address deleted successfully');
                        await loadData();
                    }
                    break;

                case 'contact':
                    if (modal.editId) {
                        await contactService.deleteContact(modal.editId);
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

    if (isLoading) {
        return (
            <div className="w-full max-w-6xl p-8 bg-white">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl p-5 font-sans">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                <p className="text-sm text-gray-600">Manage your account details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">Full Name</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                        <User className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow truncate">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <button
                            onClick={openNameModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-500"
                        >
                            <SquarePen className="w-6 h-6 cursor-pointer"></SquarePen>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">Password</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                        <Key className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow">•••••••••••••</p>
                        <button
                            onClick={openPasswordModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-500"
                        >
                            <SquarePen className="w-6 h-6 cursor-pointer"></SquarePen>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">Shipping Addresses</div>
                    {addresses.map((address) => (
                        <div key={address.id} className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                            <MapPin className="w-6 h-6 mr-3 text-gray-400"/>
                            <p className="text-gray-800 text-sm flex-grow truncate">
                                {address.street} {address.streetNumber}, {address.postalCode} {address.city}, {address.country}
                            </p>
                            <button
                                onClick={() => openAddressModal(address)}
                                className="p-1 hover:scale-110 transition-transform text-blue-500"
                            >
                                <SquarePen className="w-6 h-6 cursor-pointer"></SquarePen>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => openAddressModal()}
                        className="bg-blue-600 text-white py-2 px-4 w-48 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all mx-auto mt-3 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4"/>
                        Add Address
                    </button>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">Contact Information</div>
                    {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center bg-gray-50 p-4 rounded-lg mb-3">
                            <Mail className="w-6 h-6 mr-3 text-gray-400"/>
                            <p className="text-gray-800 text-sm flex-grow truncate">
                                {contact.email}, {contact.phoneNumber}
                            </p>
                            <button
                                onClick={() => openContactModal(contact)}
                                className="p-1 hover:scale-110 transition-transform text-blue-500"
                            >
                                <SquarePen className="w-6 h-6 cursor-pointer"></SquarePen>
                            </button>
                        </div>
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
        </div>
    );
};

export default AccountPersonalData;