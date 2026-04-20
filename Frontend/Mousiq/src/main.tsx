import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {LoginRegisterModalProvider} from "./contexts/LoginRegisterModalContext.tsx";
import {CartProvider} from "./contexts/CartContext.tsx";
import {ToastContainer} from "react-toastify";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop.tsx";
import About from "./pages/About.tsx";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import UserProtectedRoute from "./components/UserProtectedRoute.tsx";
import Contact from "./pages/Contact.tsx";
import FAQ from "./pages/FAQ.tsx";
import OurPromises from "./pages/OurPromises.tsx";
import Account from "./pages/account/Account.tsx";
import AccountPersonalData from "./pages/account/AccountPersonalData.tsx";
import AccountOrders from "./pages/account/AccountOrders.tsx";
import AccountPayments from "./pages/account/AccountPayments.tsx";
import AccountSecurity from "./pages/account/AccountSecurity.tsx";
import AccountContact from "./pages/account/AccountContact.tsx";
import Cart from "./pages/cart/Cart.tsx";
import Checkout from "./pages/cart/checkout/Checkout.tsx";
import Payment from "./pages/cart/checkout/payment/Payment.tsx";
import Products from "./pages/products/Products.tsx";
import View from "./pages/products/view/View.tsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import DashboardBrands from "./pages/dashboard/DashboardBrands.tsx";
import DashboardMessages from "./pages/dashboard/DashboardMessages.tsx";
import DashboardShippingMethods from "./pages/dashboard/DashboardShippingMethods.tsx";
import DashboardProducts from "./pages/dashboard/DashboardProducts.tsx";
import DashboardUsers from "./pages/dashboard/DashboardUsers.tsx";
import DashboardOrders from "./pages/dashboard/DashboardOrders.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <>
            <ScrollToTop/>
            <Outlet/>
        </>,
        errorElement: <NotFound/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: 'account',
                element: (
                    <UserProtectedRoute>
                        <Account/>
                    </UserProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Navigate to="/account/personal-data" replace/>
                    },
                    {
                        path: 'personal-data',
                        element: <AccountPersonalData/>
                    },
                    {
                        path: 'orders',
                        element: <AccountOrders/>
                    },
                    {
                        path: 'payments',
                        element: <AccountPayments/>
                    },
                    {
                        path: 'security',
                        element: <AccountSecurity/>
                    },
                    {
                        path: 'contact',
                        element: <AccountContact/>
                    }
                ]
            },
            {
                path: 'cart',
                element: (
                    <UserProtectedRoute>
                        <Cart/>
                    </UserProtectedRoute>
                ),
            },
            {
                path: 'cart/checkout',
                element: (
                    <UserProtectedRoute>
                        <Checkout/>
                    </UserProtectedRoute>
                ),
            },
            {
                path: 'cart/checkout/payment',
                element: (
                    <UserProtectedRoute>
                        <Payment/>
                    </UserProtectedRoute>
                ),
            },
            {
                path: 'dashboard',
                element: (
                    <AdminProtectedRoute>
                         <Dashboard/>
                     </AdminProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Navigate to="messages" replace/>
                    },
                    {
                        path: 'messages',
                        element: <DashboardMessages/>
                    },
                    {
                        path: 'orders',
                        element: <DashboardOrders/>
                    },
                    {
                        path: 'users',
                        element: <DashboardUsers/>
                    },
                    {
                        path: 'products',
                        element: <DashboardProducts/>
                    },
                    {
                        path: 'brands',
                        element: <DashboardBrands/>
                    },
                    {
                        path: 'shipping-methods',
                        element: <DashboardShippingMethods/>
                    }
                ]
            },
            {
                path: 'products',
                element: <Products/>,
            },
            {
                path: 'product/:slug',
                element: <View/>,
            },
            {
                path: 'about',
                element: <About/>,
            },
            {
                path: 'contact',
                element: <Contact/>,
            },
            {
                path: 'faq',
                element: <FAQ/>,
            },
            {
                path: 'our promises',
                element: <OurPromises/>,
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
            <AuthProvider>
                <LoginRegisterModalProvider>
                    <CartProvider>
                        <ToastContainer/>
                        <RouterProvider router={router}></RouterProvider>
                    </CartProvider>
                </LoginRegisterModalProvider>
            </AuthProvider>
    </StrictMode>,
)
