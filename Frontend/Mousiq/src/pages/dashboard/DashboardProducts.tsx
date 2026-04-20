import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Plus, Search, DollarSign, Package as PackageIcon} from "lucide-react";
import Pagination from "../../components/Pagination.jsx";
import DynamicModal, {type Field, type FieldOption} from "../../components/DynamicModal.jsx";
import productService from "../../services/product.service.ts";
import brandService from "../../services/brand.service.ts";
import {toast} from "react-toastify";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {type ProductSummary, SensorType, ConnectionType, GripType} from "../../types/product.types.js";
import {type Brand} from "../../types/brand.types.js";

interface ModalState {
    isOpen: boolean;
    type: 'product' | '';
    title: string;
    fields: Field[];
    initialData: Record<string, unknown>;
    editId: string | null;
}

const DashboardProducts: React.FC = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<ProductSummary[]>([]);
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
            const response = await productService.getProducts({
                page: currentPage - 1,
                size: 10,
                sortBy: 'name',
                sortDir: 'asc',
                name: debouncedSearchTerm
            });
            setProducts(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load products');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to fetch products:', error);
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

    const openProductModal = async (product: ProductSummary | null = null) => {
        try {
            const brands = await brandService.getAllBrands();

            let fullProduct = null;
            if (product) {
                fullProduct = await productService.getProductById(product.id);
            }

            setModal({
                isOpen: true,
                type: 'product',
                title: product ? 'Edit product' : 'Add new product',
                fields: [
                    {name: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter mouse name', required: true},
                    {name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter product description', required: false},
                    {
                        name: 'brandName',
                        label: 'Brand',
                        type: 'select',
                        options: brands as unknown as FieldOption[],
                        getOptionLabel: (b: FieldOption) => (b as unknown as Brand).name,
                        getOptionValue: (b: FieldOption) => (b as unknown as Brand).name,
                        required: true
                    },
                    {name: 'dpi', label: 'DPI', type: 'number', placeholder: '16000', min: 100, max: 30000, required: true},
                    {
                        name: 'sensorType',
                        label: 'Sensor Type',
                        type: 'select',
                        options: Object.values(SensorType).map(st => ({label: st, value: st})),
                        getOptionLabel: (option: FieldOption) => (option as {label: string}).label,
                        getOptionValue: (option: FieldOption) => (option as {value: string}).value,
                        required: true
                    },
                    {
                        name: 'wireless',
                        label: 'Wireless',
                        type: 'select',
                        options: [
                            {label: 'Yes', value: 'true'},
                            {label: 'No', value: 'false'},
                        ],
                        getOptionLabel: (option: FieldOption) => (option as {label: string}).label,
                        getOptionValue: (option: FieldOption) => (option as {value: string}).value,
                        required: true,
                    },
                    {
                        name: 'connectionType',
                        label: 'Connection Type',
                        type: 'select',
                        options: Object.values(ConnectionType).map(ct => ({label: ct.replace('_', ' '), value: ct})),
                        getOptionLabel: (option: FieldOption) => (option as {label: string}).label,
                        getOptionValue: (option: FieldOption) => (option as {value: string}).value,
                        required: true
                    },
                    {name: 'numberOfButtons', label: 'Number of Buttons', type: 'number', placeholder: '6', min: 2, max: 20, required: true},
                    {
                        name: 'rgbLighting',
                        label: 'RGB Lighting',
                        type: 'select',
                        options: [
                            {label: 'Yes', value: 'true'},
                            {label: 'No', value: 'false'},
                        ],
                        getOptionLabel: (option: FieldOption) => (option as {label: string}).label,
                        getOptionValue: (option: FieldOption) => (option as {value: string}).value,
                        required: true,
                    },
                    {name: 'weight', label: 'Weight (grams)', type: 'number', placeholder: '75', min: 30, max: 200, step: '0.1', required: true},
                    {name: 'color', label: 'Color', type: 'text', placeholder: 'Black', required: true},
                    {
                        name: 'programmableButtons',
                        label: 'Programmable Buttons',
                        type: 'select',
                        options: [
                            {label: 'Yes', value: 'true'},
                            {label: 'No', value: 'false'},
                        ],
                        getOptionLabel: (option: FieldOption) => (option as {label: string}).label,
                        getOptionValue: (option: FieldOption) => (option as {value: string}).value,
                        required: true,
                    },
                    {name: 'pollingRate', label: 'Polling Rate (Hz)', type: 'number', placeholder: '1000', min: 125, max: 8000, required: true},
                    {
                        name: 'gripType',
                        label: 'Grip Type',
                        type: 'select',
                        options: Object.values(GripType).map(gt => ({label: gt, value: gt})),
                        getOptionLabel: (option: FieldOption) => (option as {label: string}).label,
                        getOptionValue: (option: FieldOption) => (option as {value: string}).value,
                        required: true
                    },
                    {name: 'batteryLife', label: 'Battery Life (hours)', type: 'number', placeholder: '70', min: 0, required: false},
                    {name: 'price', label: 'Price ($)', type: 'number', placeholder: '79.99', step: '0.01', min: 0.0, required: true},
                    {name: 'quantity', label: 'Stock Quantity', type: 'number', placeholder: '50', min: 0, required: true},
                    {name: 'image', label: 'Product Image', type: 'file', required: !product},
                ],
                initialData: fullProduct
                    ? {
                        ...fullProduct,
                        brandName: fullProduct.brand.name,
                        wireless: String(fullProduct.wireless),
                        rgbLighting: String(fullProduct.rgbLighting),
                        programmableButtons: String(fullProduct.programmableButtons),
                    } : {},
                editId: product?.id || null,
            });
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to open product modal');
            toast.error(getErrorMessage(apiError));
            console.error('Failed to open modal:', error);
        }
    };

    const handleSave = async (formData: Record<string, unknown>) => {
        try {
            const productRequest = {
                name: formData.name as string,
                description: (formData.description as string) || undefined,
                brandName: formData.brandName as string,
                dpi: parseInt(formData.dpi as string),
                sensorType: formData.sensorType as SensorType,
                wireless: formData.wireless === 'true' || formData.wireless === true,
                connectionType: formData.connectionType as ConnectionType,
                numberOfButtons: parseInt(formData.numberOfButtons as string),
                rgbLighting: formData.rgbLighting === 'true' || formData.rgbLighting === true,
                weight: parseFloat(formData.weight as string),
                color: formData.color as string,
                programmableButtons: formData.programmableButtons === 'true' || formData.programmableButtons === true,
                pollingRate: parseInt(formData.pollingRate as string),
                gripType: formData.gripType as GripType,
                batteryLife: formData.batteryLife ? parseInt(formData.batteryLife as string) : undefined,
                price: parseFloat(formData.price as string),
                quantity: parseInt(formData.quantity as string)
            };

            const imageFile = formData.image as File | undefined;

            if (modal.editId) {
                await productService.editProduct(modal.editId, productRequest, imageFile);
                toast.success('Product updated successfully');
            } else {
                if (!imageFile) {
                    throw new Error('Image is required for new products');
                }
                await productService.addProduct(productRequest, imageFile);
                toast.success('Product added successfully');
            }

            await loadData();
        } catch (error) {
            const apiError = parseApiError(error, `Failed to ${modal.editId ? 'update' : 'add'} product`);
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            if (modal.type === 'product' && modal.editId) {
                await productService.deleteProduct(modal.editId);
                toast.success('Product deleted successfully');
                await loadData();
            }
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to delete product');
            toast.error(getErrorMessage(apiError));
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <div className="ml-4 text-lg">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-5">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                <p className="text-gray-600 mt-2">Manage your mouse inventory</p>
            </div>

            <div className="flex items-center w-full gap-2 mb-4">
                <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <Search className="w-5 h-5 mr-2 text-gray-400"/>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products by name..."
                        autoComplete="off"
                        className="flex-1 outline-none bg-transparent text-sm"
                    />
                </div>

                <button
                    onClick={() => openProductModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer font-medium shadow-sm"
                >
                    <Plus className="w-4 h-4"/>
                    Add Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 mb-4">
                        <PackageIcon className="w-16 h-16 mx-auto flex-shrink-0" strokeWidth={1.5}/>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm ? 'Try a different search term' : 'Get started by adding your first gaming mouse'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => openProductModal()}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4 flex-shrink-0"/>
                            Add First Product
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
                                    Product ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Brand
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                        {product.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}
                                            alt={product.name}
                                            className="w-20 h-20 object-contain select-none rounded border border-gray-200"
                                            loading="lazy"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                                        <div className="line-clamp-2">{product.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {product.brandName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-1 text-green-700 font-semibold">
                                            <DollarSign className="w-4 h-4 flex-shrink-0"/>
                                            {product.price.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center text-center px-2 py-1 rounded-full text-xs font-medium ${
                                            product.quantity > 10
                                                ? 'bg-green-100 text-green-800'
                                                : product.quantity > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.quantity} in stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => openProductModal(product)}
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

            {products.length > 0 && (
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

export default DashboardProducts;