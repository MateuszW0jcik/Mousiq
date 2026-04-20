import React, {useState} from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import {useCart} from "../../contexts/CartContext.jsx";
import CartProductItem from "../../components/CartProductItem.jsx";
import CartImage from "../../assets/cart-path/cart.png";
import {Link} from "react-router-dom";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {toast} from 'react-toastify';
import {type ShoppingCartItem} from "../../types/shopping-cart.types.js";

const Cart: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const {cartItems, subTotal, deleteUserShoppingCartItem, updateUserShoppingCartItem} = useCart();

    const handleQuantityDecrease = async (item: ShoppingCartItem) => {
        if (item.quantity > 1 && !loading) {
            setLoading(true);
            try {
                await updateUserShoppingCartItem(
                    item.id,
                    {
                        quantity: item.quantity - 1
                    });
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to decrease quantity');
                toast.error(getErrorMessage(apiError));
                console.error('Error decreasing quantity:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleQuantityIncrease = async (item: ShoppingCartItem) => {
        if (!loading) {
            setLoading(true);
            try {
                await updateUserShoppingCartItem(
                    item.id,
                    {
                        quantity: item.quantity + 1
                    });
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to increase quantity');
                toast.error(getErrorMessage(apiError));
                console.error('Error increasing quantity:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRemoveProduct = async (item: ShoppingCartItem) => {
        if (!loading) {
            setLoading(true);
            try {
                await deleteUserShoppingCartItem(item.id);
                toast.success('Product removed from cart');
            } catch (error) {
                const apiError = parseApiError(error, 'Failed to remove product');
                toast.error(getErrorMessage(apiError));
                console.error('Error removing product:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header/>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <div className="ml-4 text-lg">Loading...</div>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Header/>

            <div className="max-w-5xl mx-auto p-5 flex justify-center">
                <div className="w-full">
                    <div className="my-8 mb-12">
                        <img
                            src={CartImage}
                            alt="Shopping cart steps"
                            className="select-none mx-auto"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5 relative">
                        <div className="lg:col-span-2">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h3>
                                    <p className="text-gray-500 mb-6">Add some gaming mice to get started!</p>
                                    <Link
                                        to="/products"
                                        className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <CartProductItem
                                        key={item.id}
                                        item={item}
                                        loading={loading}
                                        onQuantityDecrease={handleQuantityDecrease}
                                        onQuantityIncrease={handleQuantityIncrease}
                                        onRemoveProduct={handleRemoveProduct}
                                    />
                                ))
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div
                                className="rounded-2xl p-4 pb-5 h-fit w-full lg:min-w-[400px] box-border border border-gray-200 shadow-sm">
                                <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
                                <div className="flex justify-between my-3 text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between my-3 text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-500">Calculated at checkout</span>
                                </div>
                                <hr className="my-4 border-gray-200"/>
                                <h4 className="flex justify-between text-lg font-semibold mt-5">
                                    <span>Total</span>
                                    <span className="text-blue-600">${subTotal.toFixed(2)}</span>
                                </h4>
                                <div>
                                    <Link
                                        to="/cart/checkout"
                                        className={`block w-full bg-blue-600 text-white border-none rounded px-6 py-3 text-base font-bold cursor-pointer mt-4 transition-transform hover:scale-105 text-center ${
                                            cartItems.length === 0 || loading
                                                ? 'opacity-50 cursor-not-allowed hover:scale-100'
                                                : ''
                                        }`}
                                        onClick={(e) => {
                                            if (cartItems.length === 0 || loading) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        {loading ? 'Processing...' : 'Proceed to Checkout'}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer/>
        </>
    );
};

export default Cart;