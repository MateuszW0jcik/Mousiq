import React from 'react';
import {Link} from 'react-router-dom';
import type {ProductSummary} from '../types/product.types';

interface ProductCardProps {
    product: ProductSummary;
    onAddToCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({product, onAddToCart}) => {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onAddToCart(product.id);
    };

    return (
        <article
            className="w-full h-96 p-4 border border-gray-200 rounded-lg transition-all duration-300 flex flex-col cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg">
            <Link to={`/product/${product.slug}`}>
                <img
                    src={product.imageUrl || 'https://dummyimage.com/280x200/ffffff/000000.png&text=Loading'}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-2 select-none"
                    loading="lazy"
                    width="280"
                    height="200"
                />
                <h3
                    className="font-bold text-black my-2 flex-grow overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: '48px'
                    }}
                >
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                <div className="font-bold text-black mb-2">${product.price.toFixed(2)}</div>
            </Link>
            <button
                className="w-full text-white border-none py-2 px-4 rounded cursor-pointer transition-colors duration-300 bg-gray-800 hover:bg-black"
                onClick={handleAddToCart}
            >
                Add to Cart
            </button>
        </article>
    );
};

export default ProductCard;