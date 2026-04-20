/* eslint-disable react-refresh/only-export-components */
import React, {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import {shoppingCartService} from '../services/shopping-cart.service';
import {useAuth} from './AuthContext';
import {parseApiError, getErrorMessage} from '../services/api.service';
import type {ShoppingCartItem, ShoppingCartItemRequest, UpdateQuantityRequest} from '../types/shopping-cart.types';

interface CartContextType {
    cartItems: ShoppingCartItem[];
    itemsCount: number;
    loading: boolean;
    subTotal: number;
    fetchCart: () => Promise<void>;
    addUserShoppingCartItem: (request: ShoppingCartItemRequest) => Promise<void>;
    deleteUserShoppingCartItem: (id: string) => Promise<void>;
    updateUserShoppingCartItem: (id: string, request: UpdateQuantityRequest) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
    const [cartItems, setCartItems] = useState<ShoppingCartItem[]>([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const {isAuthenticated} = useAuth();

    const subTotal = cartItems.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated]);

    const fetchCart = async (): Promise<void> => {
        try {
            if (isAuthenticated) {
                setLoading(true);
                const cartData = await shoppingCartService.getUserCart();
                setCartItems(cartData);
                setItemsCount(cartData.length);
            } else {
                setCartItems([]);
                setItemsCount(0);
            }
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to load cart');
            console.error('Cart fetch error:', getErrorMessage(apiError));
            setCartItems([]);
            setItemsCount(0);
        } finally {
            setLoading(false);
        }
    };

    const updateUserShoppingCartItem = async (
        id: string,
        request: UpdateQuantityRequest
    ): Promise<void> => {
        await shoppingCartService.updateCartItem(id, request);
        await fetchCart();
    };

    const addUserShoppingCartItem = async (request: ShoppingCartItemRequest): Promise<void> => {
        await shoppingCartService.addToCart(request);
        await fetchCart();
    };

    const deleteUserShoppingCartItem = async (id: string): Promise<void> => {
        await shoppingCartService.removeFromCart(id);
        await fetchCart();
    };

    const value: CartContextType = {
        cartItems,
        itemsCount,
        loading,
        subTotal,
        fetchCart,
        addUserShoppingCartItem,
        deleteUserShoppingCartItem,
        updateUserShoppingCartItem,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};