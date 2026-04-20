import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useAuth} from '../contexts/AuthContext';
import {useCart} from '../contexts/CartContext';
import {useLoginRegisterModal} from '../contexts/LoginRegisterModalContext';
import {productService} from '../services/product.service';
import {isStandardError, parseApiError} from '../services/api.service';
import type {Product} from '../types/product.types';
import {getConnectionTypeName, getGripTypeName, getSensorTypeName} from "../utils/product.utils.ts";

const ProductDetails: React.FC = () => {
    const {slug} = useParams<{slug: string}>();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {isAuthenticated} = useAuth();
    const {addUserShoppingCartItem} = useCart();
    const {openModal} = useLoginRegisterModal();

    useEffect(() => {
        const getProduct = async () => {
            if (!slug) {
                setError('Product not found');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await productService.getProductBySlug(slug);
                setProduct(data);
                setError(null);
            } catch (err) {
                const apiError = parseApiError(err, 'Failed to load product');

                if (isStandardError(apiError)) {
                    setError(apiError.message);
                } else {
                    setError('Failed to load product');
                }
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [slug]);

    const handleAddToCart = async () => {
        if (isAuthenticated) {
            try {
                await addUserShoppingCartItem({
                    productId: product!.id,
                    quantity: 1
                });
                toast.success('Product added to cart successfully!');
            } catch (err) {
                const apiError = parseApiError(err, 'Failed to add to cart');

                if (isStandardError(apiError)) {
                    toast.error(apiError.message);
                } else {
                    toast.error('Failed to add to cart');
                }
            }
        } else {
            openModal();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error || 'Product not found'}</p>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 mb-5">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                    Home &gt;
                </Link>
                <Link to="/products" className="text-gray-500 hover:text-gray-700 ml-1">
                    Products &gt;
                </Link>
                <span className="text-blue-500 font-bold ml-1">{product.name}</span>
            </div>

            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Image + Technical Specifications */}
                <div className="space-y-8">
                    {/* Product Image */}
                    <div className="flex justify-center items-center">
                        <img
                            src={product.imageUrl || 'https://dummyimage.com/600x600/ffffff/000000.png&text=No+Image'}
                            alt={product.name}
                            className="w-full max-w-lg aspect-square object-contain select-none"
                            loading="lazy"
                        />
                    </div>

                    {/* Technical Specifications Table */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h2>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Brand</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.brand.name}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">DPI</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.dpi.toLocaleString()}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Sensor Type</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{getSensorTypeName(product.sensorType)}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Connection</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">
                                        {product.wireless ? 'Wireless' : 'Wired'} - {getConnectionTypeName(product.connectionType)}
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Polling Rate</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.pollingRate} Hz</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Buttons</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.numberOfButtons}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Programmable Buttons</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.programmableButtons ? 'Yes' : 'No'}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">RGB Lighting</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.rgbLighting ? 'Yes' : 'No'}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Weight</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.weight}g</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Color</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{product.color}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-700">Grip Type</td>
                                    <td className="py-3 px-4 text-sm text-gray-900">{getGripTypeName(product.gripType)}</td>
                                </tr>
                                {product.batteryLife && (
                                    <tr className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-700">Battery Life</td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{product.batteryLife}h</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Product Info */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-semibold text-gray-900 m-0">{product.name}</h1>

                    {product.description && (
                        <p className="text-gray-700 m-0">{product.description}</p>
                    )}

                    <div className="flex items-baseline gap-3">
                        <p className="text-2xl font-bold text-gray-900 m-0">${product.price.toFixed(2)}</p>
                        {product.quantity > 0 ? (
                            <span className="text-sm text-green-600 font-medium">In Stock</span>
                        ) : (
                            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                        )}
                    </div>

                    <div className="mt-1">
                        <button
                            className="w-full text-white border-none py-3 px-4 rounded cursor-pointer transition-colors duration-300 bg-gray-800 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            type="button"
                        >
                            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetails;