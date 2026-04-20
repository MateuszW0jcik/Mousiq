import React, {useState, useEffect} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import ProductCard from './ProductCard';
import type {ProductSummary} from '../types/product.types';

interface ProductSliderProps {
    title: string;
    products: ProductSummary[];
    onAddToCart: (productId: string) => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({title, products, onAddToCart}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const itemsPerView = 4;
    const maxIndex = Math.max(0, products.length - itemsPerView);

    const nextSlide = () => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(Math.min(index, maxIndex));
    };

    useEffect(() => {
        if (products.length <= itemsPerView || isHovered) return;

        const intervalId = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [currentIndex, products.length, isHovered]);

    const totalDots = maxIndex + 1;

    return (
        <section className="p-8 max-w-7xl mx-auto" aria-label={title}>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>

            <div
                className="relative px-10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Previous Arrow */}
                <button
                    className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 bg-white border border-gray-200 rounded-full cursor-pointer text-2xl flex items-center justify-center z-10 transition-all duration-300 hover:bg-gray-50 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    aria-label="Previous products"
                >
                    <ChevronLeft size={24}/>
                </button>

                {/* Slider Container */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`}}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex-none px-2"
                                style={{width: `${100 / itemsPerView}%`}}
                            >
                                <ProductCard product={product} onAddToCart={onAddToCart}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Arrow */}
                <button
                    className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 bg-white border border-gray-200 rounded-full cursor-pointer text-2xl flex items-center justify-center z-10 transition-all duration-300 hover:bg-gray-50 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={nextSlide}
                    disabled={currentIndex === maxIndex}
                    aria-label="Next products"
                >
                    <ChevronRight size={24}/>
                </button>
            </div>

            {/* Navigation Dots */}
            {totalDots > 1 && (
                <div className="flex justify-center gap-2 mt-8" role="tablist">
                    {Array.from({length: totalDots}, (_, i) => (
                        <button
                            key={i}
                            className={`w-2 h-2 rounded-full border-none p-0 cursor-pointer transition-colors duration-300 ${
                                i === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                            }`}
                            onClick={() => goToSlide(i)}
                            role="tab"
                            aria-selected={i === currentIndex}
                            aria-label={`Product ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProductSlider;