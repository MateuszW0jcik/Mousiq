import React, {useEffect, useRef, useState} from 'react';
import LoginRegisterModal from './LoginRegisterModal';
import {Link} from 'react-router-dom';
import {User, PhoneCall, Search, ShoppingCart} from 'lucide-react';
import Logo from '../assets/logo.png';
import {useAuth} from '../contexts/AuthContext';
import UserDropdown from './UserDropdown';
import {useCart} from '../contexts/CartContext';
import {useLoginRegisterModal} from '../contexts/LoginRegisterModalContext';
import SearchModal from './SearchModal';
import CartDropdown from './CartDropdown';

const Header: React.FC = () => {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const {isModalOpen, openModal, closeModal} = useLoginRegisterModal();
    const {isAuthenticated, user} = useAuth();
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const cartDropdownRef = useRef<HTMLDivElement>(null);
    const {itemsCount} = useCart();

    const toggleSearch = () => setSearchOpen(prev => !prev);
    const toggleUserDropdown = () => setUserDropdownOpen(prev => !prev);
    const toggleCartDropdown = () => setCartDropdownOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserDropdownOpen(false);
            }
            if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
                setCartDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserButtonClick = () => {
        if (isAuthenticated) {
            toggleUserDropdown();
        } else {
            openModal();
        }
    };

    const handleCartButtonClick = () => {
        if (isAuthenticated) {
            toggleCartDropdown();
        } else {
            openModal();
        }
    };

    return (
        <>
            <header className="flex justify-between items-center p-5 bg-gray-100 border-b-2 border-gray-800 relative">
                <div className="flex items-center select-none">
                    <Link to="/">
                        <img src={Logo} alt="MouseStore Logo" width="70" height="70"/>
                    </Link>
                </div>

                <button
                    className="flex md:hidden flex-col justify-between w-8 h-5 bg-transparent border-none cursor-pointer p-0 z-10"
                    aria-label="Toggle menu"
                >
                    <span className="w-full h-1 bg-gray-800 transition duration-300"></span>
                    <span className="w-full h-1 bg-gray-800 transition duration-300"></span>
                    <span className="w-full h-1 bg-gray-800 transition duration-300"></span>
                    <span className="w-full h-1 bg-gray-800 transition duration-300"></span>
                </button>

                <nav
                    className="flex gap-5 z-10 max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:bg-gray-100 max-md:flex-col max-md:p-5 max-md:gap-4 max-md:-translate-y-full max-md:opacity-0 max-md:invisible max-md:transition-all max-md:duration-300">
                    <Link
                        className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-600"
                        to="/"
                    >
                        Home
                    </Link>

                    <Link
                        className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-600"
                        to="/products"
                    >
                        Products
                    </Link>

                    <Link
                        className="no-underline text-gray-800 font-medium transition-colors duration-300 hover:text-blue-600"
                        to="/contact"
                    >
                        Contact us
                    </Link>

                    <div className="flex items-center gap-1">
                        <PhoneCall className="select-none text-gray-700"/>
                        <span>34 377 00 00</span>
                    </div>
                </nav>

                <div className="flex gap-1 items-center">
                    <button
                        aria-label="Search"
                        onClick={toggleSearch}
                        className="relative bg-transparent border-0 cursor-pointer p-1.5 transition-transform duration-300 hover:scale-110 select-none"
                    >
                        <Search className="select-none text-gray-700"/>
                    </button>

                    <div className="relative" ref={cartDropdownRef}>
                        <button
                            aria-label="Shopping cart"
                            onClick={handleCartButtonClick}
                            className="relative bg-transparent border-0 cursor-pointer p-1.5 transition-transform duration-300 hover:scale-110 select-none"
                        >
                            <ShoppingCart className="select-none text-gray-700"/>
                            <span
                                className="absolute -top-1 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
                                {itemsCount}
                            </span>
                        </button>

                        <CartDropdown isOpen={cartDropdownOpen} onClose={() => setCartDropdownOpen(false)}/>
                    </div>

                    <div className="relative" ref={userDropdownRef}>
                        <button
                            aria-label="User account"
                            onClick={handleUserButtonClick}
                            className="relative bg-transparent border-0 cursor-pointer p-1.5 transition-transform duration-300 hover:scale-110 select-none"
                        >
                            <User className="select-none text-gray-700"/>
                        </button>

                        <UserDropdown
                            isOpen={userDropdownOpen}
                            onClose={() => setUserDropdownOpen(false)}
                            userInfo={user}
                        />
                    </div>
                </div>
            </header>

            {!isAuthenticated && (
                <LoginRegisterModal isOpen={isModalOpen} onClose={closeModal} onLoginSuccess={() => closeModal}/>
            )}

            <SearchModal isOpen={searchOpen} onClose={toggleSearch}/>
        </>
    );
};

export default Header;