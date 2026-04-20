import React, {useState} from 'react';
import {Key, Mail, SquarePen} from 'lucide-react';
import DynamicModal, {type Field} from "../../components/DynamicModal.jsx";
import {useAuth} from "../../contexts/AuthContext.jsx";
import userService from "../../services/user.service.ts";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {toast} from 'react-toastify';

interface ModalState {
    isOpen: boolean;
    type: 'password' | 'email' | '';
    title: string;
    fields: Field[];
    initialData: Record<string, string>;
}

const AccountSecurity: React.FC = () => {
    const {user, refreshUser} = useAuth();
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {}
    });

    const closeModal = () => {
        setModal({
            isOpen: false,
            type: '',
            title: '',
            fields: [],
            initialData: {}
        });
    };

    const openPasswordModal = () => {
        setModal({
            isOpen: true,
            type: 'password',
            title: 'Change Password',
            fields: [
                {
                    name: 'currentPassword',
                    label: 'Current Password',
                    type: 'password',
                    placeholder: 'Enter your current password',
                    required: true
                },
                {
                    name: 'newPassword',
                    label: 'New Password',
                    type: 'password',
                    placeholder: 'Enter your new password',
                    required: true
                },
                {
                    name: 'confirmPassword',
                    label: 'Confirm New Password',
                    type: 'password',
                    placeholder: 'Re-enter your new password',
                    required: true
                }
            ],
            initialData: {}
        });
    };

    const openEmailModal = () => {
        setModal({
            isOpen: true,
            type: 'email',
            title: 'Change Login Email',
            fields: [
                {
                    name: 'currentPassword',
                    label: 'Current Password',
                    type: 'password',
                    placeholder: 'Enter password to verify',
                    required: true
                },
                {
                    name: 'newEmail',
                    label: 'New Email Address',
                    type: 'email',
                    placeholder: 'Enter new email address',
                    required: true
                },
                {
                    name: 'confirmEmail',
                    label: 'Confirm New Email',
                    type: 'email',
                    placeholder: 'Re-enter new email address',
                    required: true
                }
            ],
            initialData: {}
        });
    };

    const handleSave = async (formData: Record<string, unknown>) => {
        try {
            switch (modal.type) {
                case 'password':
                    if (formData.newPassword !== formData.confirmPassword) {
                        toast.error('Passwords do not match');
                        return;
                    }
                    await userService.changePassword({
                        oldPassword: formData.currentPassword as string,
                        newPassword: formData.newPassword as string,
                        repeatedPassword: formData.confirmPassword as string
                    });
                    toast.success('Password changed successfully!');
                    break;

                case 'email':
                    if (formData.newEmail !== formData.confirmEmail) {
                        toast.error('Email addresses do not match');
                        return;
                    }
                    await userService.changeEmail({
                        currentPassword: formData.currentPassword as string,
                        email: formData.newEmail as string
                    });
                    await refreshUser();
                    toast.success('Login email changed successfully!');
                    break;
            }
        } catch (error) {
            const apiError = parseApiError(error, `Failed to change ${modal.type}`);
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    return (
        <div className="w-full max-w-6xl p-5 font-sans">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Security Settings</h3>
                <p className="text-sm text-gray-600">Manage your password and login credentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">Password</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                        <Key className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow">•••••••••••••</p>
                        <button
                            onClick={openPasswordModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-500"
                        >
                            <SquarePen className="w-6 h-6 cursor-pointer"></SquarePen>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Use a strong password with at least 8 characters, including numbers and symbols
                    </p>
                </div>

                <div className="flex flex-col mb-6 max-w-md">
                    <div className="text-sm text-gray-600 mb-2">Login Email</div>
                    <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                        <Mail className="w-6 h-6 mr-3 text-gray-400"/>
                        <p className="text-gray-800 text-sm flex-grow truncate">
                            {user?.email || 'No email set'}
                        </p>
                        <button
                            onClick={openEmailModal}
                            className="p-1 hover:scale-110 transition-transform text-blue-500"
                        >
                            <SquarePen className="w-6 h-6 cursor-pointer"></SquarePen>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        This email is used to log in to your Mousiq account
                    </p>
                </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-medium text-blue-900 mb-3">Security Tips</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Use a unique password that you don't use on other websites
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Change your password regularly, at least every 3-6 months
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Never share your password with anyone, including Mousiq staff
                    </li>
                    <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Be cautious of phishing emails asking for your login credentials
                    </li>
                </ul>
            </div>

            <DynamicModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                fields={modal.fields}
                initialData={modal.initialData}
                onSave={handleSave}
                showDelete={false}
            />
        </div>
    );
};

export default AccountSecurity;