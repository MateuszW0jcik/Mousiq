import React, {useState, useEffect} from 'react';
import Header from "../components/Header.jsx";
import HeroBannerSlider from "../components/HeroBannerSlider.jsx";
import ProductSlider from "../components/ProductSlider.jsx";
import productService from "../services/product.service.ts";
import {toast} from 'react-toastify';
import {Link} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useCart} from "../contexts/CartContext.jsx";
import {useLoginRegisterModal} from "../contexts/LoginRegisterModalContext.jsx";
import {parseApiError, getErrorMessage} from "../services/api.service.js";
import type {ProductSummary} from "../types/product.types.ts";

const Home: React.FC = () => {
    const [newProducts, setNewProducts] = useState<ProductSummary[]>([]);
    const [bestSellers, setBestSellers] = useState<ProductSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {isAuthenticated} = useAuth();
    const {addUserShoppingCartItem} = useCart();
    const {openModal} = useLoginRegisterModal();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const newProductsData = await productService.getNewProducts();
                setNewProducts(newProductsData);

                const bestSellersData = await productService.getBestSellers();
                setBestSellers(bestSellersData);

            } catch (err) {
                const apiError = parseApiError(err, 'Failed to load products');
                setError(getErrorMessage(apiError));
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (productId: string) => {
        if (isAuthenticated) {
            try {
                await addUserShoppingCartItem({
                    productId: productId,
                    quantity: 1
                });
                toast.success('Product added to cart successfully!');
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to add product to cart');
                toast.error(getErrorMessage(apiError));
            }
        } else {
            openModal();
        }
    };

    if (loading) {
        return (
            <>
                <Header/>
                <HeroBannerSlider/>

                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div className="ml-4 text-lg">Loading...</div>
                </div>

                <Link to="/products">
                    <img
                        src="src/assets/banners/banner4.jpg"
                        className="block w-full max-w-7xl mx-auto mb-4 p-4"
                        alt="Browse all mice"
                    />
                </Link>

                <section className="px-4 py-8 max-w-7xl mx-auto" aria-label="Top Mouse Brands">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold">Top Mouse Brands</h2>
                    </div>
                    <div
                        className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-10 md:gap-12 py-5 unselectable">
                        <img src="src/assets/producers/apple-logo.png" alt="Razer"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/beats-logo.png" alt="SteelSeries"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/bose-logo.png" alt="Corsair"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/jbl-logo.png" alt="Glorious"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/sennheiser-logo.png" alt="Finalmouse"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/sony-logo.png" alt="Zowie"
                             className="h-8 sm:h-10 object-contain select-none"/>
                    </div>
                </section>

                <Footer/>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header/>
                <HeroBannerSlider/>

                <div className="flex justify-center items-center py-20">
                    <div className="text-lg text-red-500">{error}</div>
                </div>

                <Link to="/products">
                    <img
                        src="src/assets/banners/banner4.jpg"
                        className="block w-full max-w-7xl mx-auto mb-4 p-4"
                        alt="Browse all mice"
                    />
                </Link>

                <section className="px-4 py-8 max-w-7xl mx-auto" aria-label="Top Mouse Brands">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold">Top Mouse Brands</h2>
                    </div>
                    <div
                        className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-10 md:gap-12 py-5 unselectable">
                        <img src="src/assets/producers/apple-logo.png" alt="Razer"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/beats-logo.png" alt="SteelSeries"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/bose-logo.png" alt="Corsair"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/jbl-logo.png" alt="Glorious"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/sennheiser-logo.png" alt="Finalmouse"
                             className="h-8 sm:h-10 object-contain select-none"/>
                        <img src="src/assets/producers/sony-logo.png" alt="Zowie"
                             className="h-8 sm:h-10 object-contain select-none"/>
                    </div>
                </section>

                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header/>
            <HeroBannerSlider/>

            {newProducts.length > 0 && (
                <ProductSlider
                    title="New Arrivals"
                    products={newProducts}
                    onAddToCart={handleAddToCart}
                />
            )}

            <Link to="/products">
                <img
                    src="src/assets/banners/banner4.jpg"
                    className="block w-full max-w-7xl mx-auto mb-4 p-4 select-none"
                    alt="Browse all mice"
                />
            </Link>

            {bestSellers.length > 0 && (
                <ProductSlider
                    title="Best Sellers"
                    products={bestSellers}
                    onAddToCart={handleAddToCart}
                />
            )}

            <section className="px-4 py-8 max-w-7xl mx-auto" aria-label="Top Mouse Brands">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold">Top Mouse Brands</h2>
                </div>
                <div
                    className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-10 md:gap-12 py-5 unselectable">
                    <img src="src/assets/producers/razer-logo.png" alt="Razer"
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/steelseries-logo.png" alt="SteelSeries"
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/corsair-logo.png" alt="Corsair"
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/glorious-logo.png" alt="Glorious"
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/logitech-logo.png" alt="Logitech"
                         className="h-8 sm:h-10 object-contain select-none"/>
                    <img src="src/assets/producers/zowie-logo.png" alt="Zowie"
                         className="h-8 sm:h-10 object-contain select-none"/>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Home;