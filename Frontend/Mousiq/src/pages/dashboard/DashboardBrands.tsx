import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Plus, Search} from 'lucide-react';
import brandService from "../../services/brand.service.ts";
import Pagination from "../../components/Pagination.jsx";
import DynamicModal, {type Field} from "../../components/DynamicModal.jsx";
import {toast} from "react-toastify";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {type Brand} from "../../types/brand.types.js";

interface ModalState {
    isOpen: boolean;
    type: 'brand' | '';
    title: string;
    fields: Field[];
    initialData: Record<string, string>;
    editId: string | null;
}

const DashboardBrands: React.FC = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [brands, setBrands] = useState<Brand[]>([]);
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
            const response = await brandService.getBrands({
                page: currentPage - 1,
                size: 10,
                sortBy: 'name',
                sortDir: 'asc',
                name: debouncedSearchTerm
            });
            setBrands(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load brands');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to fetch brands:', error);
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

    const openBrandModal = (brand: Brand | null = null) => {
        setModal({
            isOpen: true,
            type: 'brand',
            title: brand ? 'Edit Brand' : 'Add New Brand',
            fields: [
                { name: 'name', label: 'Brand Name', type: 'text', placeholder: 'Enter brand name', required: true },
            ],
            initialData: brand ? { name: brand.name } : {},
            editId: brand?.id || null
        });
    };

    const handleSave = async (formData: Record<string, unknown>) => {
        try {
            if (modal.type === 'brand') {
                if (modal.editId) {
                    await brandService.editBrand(modal.editId, {
                        name: formData.name as string
                    });
                    toast.success('Brand updated successfully');
                } else {
                    await brandService.addBrand({
                        name: formData.name as string
                    });
                    toast.success('Brand added successfully');
                }
                await loadData();
            }
        } catch (error) {
            const apiError = parseApiError(error, `Failed to ${modal.editId ? 'update' : 'add'} brand`);
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            if (modal.type === 'brand' && modal.editId) {
                await brandService.deleteBrand(modal.editId);
                toast.success('Brand deleted successfully');
                await loadData();
            }
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete brand');
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">Loading brands...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-5">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
                <p className="text-gray-600 mt-2">Manage gaming mouse brands</p>
            </div>

            <div className="flex items-center w-full gap-2 mb-4">
                <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <Search className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0"/>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search brands by name..."
                        autoComplete="off"
                        className="flex-1 outline-none bg-transparent text-sm"
                    />
                </div>

                <button
                    onClick={() => openBrandModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4"/>
                    Add Brand
                </button>
            </div>

            {brands.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Brands Found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? 'Try a different search term' : 'Get started by adding your first brand'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => openBrandModal()}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4 flex-shrink-0"/>
                            Add First Brand
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
                                    Brand ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {brands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                        {brand.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {brand.name}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => openBrandModal(brand)}
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

            {brands.length > 0 && (
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

export default DashboardBrands;