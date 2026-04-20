import React, {useMemo} from 'react';
import {Link, NavLink, Outlet, useLocation} from 'react-router-dom';
import {User, Package, DollarSign, Key, Mail, Shield, LogOut} from 'lucide-react';
import {useAuth} from "../../contexts/AuthContext.jsx";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";

const Account: React.FC = () => {
    const {user, isAdmin, logout} = useAuth();
    const location = useLocation();

    const breadcrumbText = useMemo(() => {
        const path = location.pathname.toLowerCase();

        if (path.includes('personal%20data') || path.includes('personal data') || path.includes('personal-data')) return 'Personal Data';
        if (path.includes('orders')) return 'Orders';
        if (path.includes('payments')) return 'Payments';
        if (path.includes('security')) return 'Security & Access';
        if (path.includes('contact')) return 'Contact Us';
        return 'Account';
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <Header/>

            <section className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        Home &gt;
                    </Link>
                    <Link to="/account" className="text-gray-500 hover:text-gray-700 ml-1">
                        Account &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">{breadcrumbText}</span>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:items-start">
                    {/* Sidebar */}
                    <div className="w-full lg:w-72 mb-8 border border-gray-200 rounded-lg h-fit">
                        <div className="p-6">
                            {/* User Info */}
                            <div className="flex items-center mb-8">
                                <div
                                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-8 h-8 text-blue-600"/>
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {user?.firstName} {user?.lastName}
                                    </h3>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="space-y-2">
                                <NavLink
                                    to="/account/personal-data"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <User className="w-5 h-5 mr-3"/>
                                    Personal Data
                                </NavLink>

                                <NavLink
                                    to="/account/orders"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Package className="w-5 h-5 mr-3"/>
                                    Orders
                                </NavLink>

                                <NavLink
                                    to="/account/payments"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <DollarSign className="w-5 h-5 mr-3"/>
                                    Payments
                                </NavLink>

                                <NavLink
                                    to="/account/security"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Key className="w-5 h-5 mr-3"/>
                                    Security & Access
                                </NavLink>

                                <NavLink
                                    to="/account/contact"
                                    className={({isActive}) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-4 border-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`
                                    }
                                >
                                    <Mail className="w-5 h-5 mr-3"/>
                                    Contact Us
                                </NavLink>

                                {isAdmin && (
                                    <NavLink
                                        to="/dashboard"
                                        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <Shield className="w-5 h-5 mr-3"/>
                                        Admin Dashboard
                                    </NavLink>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center p-3 gap-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5 mr-3"/>
                                    Log Out
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Outlet/>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Account;