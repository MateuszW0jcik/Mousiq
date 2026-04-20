import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Plus, Search, Truck, DollarSign} from 'lucide-react';
import Pagination from "../../components/Pagination.jsx";
import DynamicModal, {type Field} from "../../components/DynamicModal.jsx";
import shippingMethodService from "../../services/shipping-method.service.ts";
import {toast} from "react-toastify";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {type ShippingMethod} from "../../types/shipping-method.types.js";

interface ModalState {
    isOpen: boolean;
    type: 'shipping_method' | '';
    title: string;
    fields: Field[];
    initialData: Record<string, string | number>;
    editId: null | string;
}

const DashboardShippingMethods: React.FC = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const currentPage = parseInt(searchParams.get('page') || '1');

    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        type: '',
        title: '',
        fields: [],
        initialData: {},
        editId: null
    });

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

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await shippingMethodService.getShippingMethods({
                page: currentPage - 1,
                size: 10,
                sortBy: 'price',
                sortDir: 'asc',
                name: debouncedSearchTerm
            });
            setShippingMethods(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load shipping methods');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to fetch shipping methods:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [debouncedSearchTerm, searchParams]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', String(newPage));
        setSearchParams(newParams);
        window.scrollTo(0, 0);
    };

    const openShippingMethodModal = (shippingMethod: ShippingMethod | null = null) => {
        setModal({
            isOpen: true,
            type: 'shipping_method',
            title: shippingMethod ? 'Edit Shipping Method' : 'Add New Shipping Method',
            fields: [
                { name: 'name', label: 'Method Name', type: 'text', placeholder: 'e.g., Standard Shipping', required: true },
                { name: 'description', label: 'Description', type: 'text', placeholder: 'e.g., Delivery in 3-5 business days', required: true },
                { name: 'price', label: 'Price ($)', type: 'number', placeholder: '9.99', required: true, step: '0.01', min: 0}
            ],
            initialData: shippingMethod ? {
                name: shippingMethod.name,
                description: shippingMethod.description,
                price: shippingMethod.price
            } : {},
            editId: shippingMethod?.id || null
        });
    };

    const handleSave = async (formData: Record<string, unknown>) => {
        try {
            if (modal.type === 'shipping_method') {
                const shippingMethodData = {
                    name: formData.name as string,
                    description: formData.description as string,
                    price: parseFloat(formData.price as string)
                };

                if (modal.editId) {
                    await shippingMethodService.editShippingMethod(modal.editId, shippingMethodData);
                    toast.success('Shipping method updated successfully');
                } else {
                    await shippingMethodService.addShippingMethod(shippingMethodData);
                    toast.success('Shipping method added successfully');
                }
                await loadData();
            }
        } catch (error) {
            const apiError = parseApiError(error, `Failed to ${modal.editId ? 'update' : 'add'} shipping method`);
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            if (modal.type === 'shipping_method' && modal.editId) {
                await shippingMethodService.deleteShippingMethod(modal.editId);
                toast.success('Shipping method deleted successfully');
                await loadData();
            }
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete shipping method');
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">Loading shipping methods...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-5">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Shipping Methods</h1>
                <p className="text-gray-600 mt-2">Manage delivery options and pricing</p>
            </div>

            <div className="flex items-center w-full gap-2 mb-4">
                <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <Search className="w-5 h-5 mr-2 text-gray-400"/>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search shipping methods by name..."
                        autoComplete="off"
                        className="flex-1 outline-none bg-transparent text-sm"
                    />
                </div>

                <button
                    onClick={() => openShippingMethodModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4"/>
                    Add Method
                </button>
            </div>

            {shippingMethods.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 mb-4">
                        <Truck className="w-16 h-16 mx-auto flex-shrink-0" strokeWidth={1.5}/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Shipping Methods Found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? 'Try a different search term' : 'Get started by adding your first shipping method'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => openShippingMethodModal()}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4 flex-shrink-0"/>
                            Add First Method
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Method ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {shippingMethods.map((shippingMethod) => (
                                <tr key={shippingMethod.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        #{shippingMethod.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <Truck className="w-4 h-4 text-gray-400 flex-shrink-0"/>
                                            {shippingMethod.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                        {shippingMethod.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-1 text-green-700 font-semibold">
                                            <DollarSign className="w-4 h-4 flex-shrink-0"/>
                                            {shippingMethod.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => openShippingMethodModal(shippingMethod)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 transform cursor-pointer shadow-sm"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {shippingMethods.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-6"
                />
            )}

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
        </div>
    );
};

export default DashboardShippingMethods;