import React from 'react';
import {Link, NavLink, Outlet} from 'react-router-dom';
import {ArrowLeft, MessageSquare, Package, Users, Mouse, Tag, Truck} from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <>
            <div className="m-5 mb-0">
                <Link
                    to="/"
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-2 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    Back to Shop
                </Link>
            </div>
            <section className="max-w-7xl mx-auto px-4 py-6">

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 border border-gray-200 rounded-2xl shadow-sm bg-white sticky top-6">
                        <div className="py-6">
                            <div className="flex justify-center pb-4 mb-4 border-b border-gray-200">
                                <h3 className="text-2xl font-bold text-blue-600">
                                    Admin Panel
                                </h3>
                            </div>

                            <nav className="space-y-1 px-3">
                                <NavLink
                                    to="/dashboard/messages"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <MessageSquare className="w-5 h-5"/>
                                    Messages
                                </NavLink>

                                <NavLink
                                    to="/dashboard/orders"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Package className="w-5 h-5"/>
                                    Orders
                                </NavLink>

                                <NavLink
                                    to="/dashboard/users"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Users className="w-5 h-5"/>
                                    Users
                                </NavLink>

                                <NavLink
                                    to="/dashboard/products"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Mouse className="w-5 h-5"/>
                                    Products
                                </NavLink>

                                <NavLink
                                    to="/dashboard/brands"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Tag className="w-5 h-5"/>
                                    Brands
                                </NavLink>

                                <NavLink
                                    to="/dashboard/shipping-methods"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Truck className="w-5 h-5"/>
                                    Shipping Methods
                                </NavLink>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-h-screen">
                        <Outlet/>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Dashboard;