import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Trash2} from 'lucide-react';
import type {ShoppingCartItem} from '../types/shopping-cart.types';

interface CartProductItemProps {
    item: ShoppingCartItem;
    loading: boolean;
    onQuantityDecrease: (item: ShoppingCartItem) => void;
    onQuantityIncrease: (item: ShoppingCartItem) => void;
    onRemoveProduct: (item: ShoppingCartItem) => void;
}

const CartProductItem: React.FC<CartProductItemProps> = ({
                                                             item,
                                                             loading,
                                                             onQuantityDecrease,
                                                             onQuantityIncrease,
                                                             onRemoveProduct
                                                         }) => {
    const [imageURL, setImageURL] = useState<string | null>(null);

    useEffect(() => {
        // Jeśli masz imageUrl w produkcie, użyj go bezpośrednio
        if (item?.product?.imageUrl) {
            setImageURL(item.product.imageUrl);
        }

        // Cleanup function
        return () => {
            if (imageURL && !item?.product?.imageUrl) {
                URL.revokeObjectURL(imageURL);
            }
        };
    }, [item?.product?.id, item?.product?.imageUrl]);

    const handleQuantityDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityDecrease(item);
    };

    const handleQuantityIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityIncrease(item);
    };

    const handleRemoveProduct = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemoveProduct(item);
    };

    const displayImage = imageURL || 'https://dummyimage.com/130x130/ffffff/000000.png&text=Loading';

    return (
        <div
            className={`relative flex items-center justify-between p-4 rounded-lg border border-gray-200 mb-3 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'
            }`}
        >
            <Link to={`/product/${item?.product.slug}`}>
                <div className="flex items-center w-full">
                    <div className="relative mr-16">
                        <img
                            src={displayImage}
                            alt="Product image"
                            className="w-32 h-32 object-contain bg-transparent select-none mx-4"
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-between w-full">
                        <p className="text-base font-bold m-0 mb-4">{item?.product.name}</p>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-sm m-0">${item?.product.price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </Link>
            <button
                onClick={handleRemoveProduct}
                disabled={loading}
                className="bg-none border-none rounded p-2 cursor-pointer transition-transform hover:scale-105 absolute top-6 right-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                <Trash2 className="w-5 h-5 text-red-500"/>
            </button>
            <div
                className="absolute bottom-6 right-6 inline-flex items-center gap-2"
                onClick={(e) => e.preventDefault()}
            >
                <button
                    onClick={handleQuantityDecrease}
                    disabled={item?.quantity <= 1 || loading}
                    className="w-8 h-8 bg-none border border-gray-200 rounded text-gray-700 cursor-pointer text-lg p-0 flex items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    −
                </button>
                <input
                    type="number"
                    value={item?.quantity}
                    min="1"
                    readOnly
                    className="w-8 h-8 border border-gray-200 rounded text-center text-sm p-0 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                <button
                    onClick={handleQuantityIncrease}
                    disabled={loading}
                    className="w-8 h-8 bg-none border border-gray-200 rounded text-gray-700 cursor-pointer text-lg p-0 flex items-center justify-center transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default CartProductItem;