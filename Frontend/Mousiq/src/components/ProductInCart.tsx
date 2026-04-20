import React from 'react';
import {Trash2} from 'lucide-react';
import {Link} from 'react-router-dom';
import type {ShoppingCartItem} from '../types/shopping-cart.types';

interface ProductInCartProps {
    shoppingCartItem: ShoppingCartItem;
    onRemove: () => void;
}

const ProductInCart: React.FC<ProductInCartProps> = ({shoppingCartItem, onRemove}) => {
    return (
        <div
            className="relative flex p-4 border border-gray-200 rounded-lg transition-all duration-300 mb-2.5 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg">
            <Link
                to={`/product/${shoppingCartItem.product.slug}`}
                className="flex items-center flex-grow"
            >
                <img
                    src={
                        shoppingCartItem.product.imageUrl ||
                        'https://dummyimage.com/130x130/ffffff/000000.png&text=Loading'
                    }
                    alt={shoppingCartItem.product.name}
                    className="w-32 h-32 object-contain bg-transparent mr-4 select-none"
                />
                <div className="flex-1">
                    <p className="font-semibold text-sm">{shoppingCartItem.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {shoppingCartItem.quantity}</p>
                    <p className="text-sm font-medium">${shoppingCartItem.product.price.toFixed(2)}</p>
                </div>
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute bottom-2 right-2 p-2 hover:scale-105 transition-transform bg-none border-none rounded cursor-pointer"
            >
                <Trash2 className="w-5 h-5 text-red-500"/>
            </button>
        </div>
    );
};

export default ProductInCart;