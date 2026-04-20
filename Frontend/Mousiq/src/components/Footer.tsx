import React from 'react';
import {Link} from 'react-router-dom';
import {MapPin, PhoneCall, Mail} from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 px-6 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="footer-section">
                    <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
                    <ul className="list-none p-0 m-0">
                        <li className="mb-4">
                            <Link
                                to="/about"
                                className="text-white no-underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                            >
                                About us
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link
                                to="/account/orders"
                                className="text-white no-underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                            >
                                Order Details
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3 className="text-lg font-semibold mb-6 text-white">Info</h3>
                    <ul className="list-none p-0 m-0">
                        <li className="mb-4">
                            <Link
                                to="/our promises"
                                className="text-white no-underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                            >
                                Our promises
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link
                                to="/faq"
                                className="text-white no-underline opacity-80 hover:opacity-100 transition-opacity duration-200"
                            >
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3 className="text-lg font-semibold mb-6 text-white">Contact us</h3>
                    <div className="flex items-center mb-4 gap-3">
                        <MapPin className="select-none w-5 h-5 opacity-80 text-gray-200"/>
                        <span className="text-sm opacity-80">123 Main Street, Anytown, USA</span>
                    </div>
                    <div className="flex items-center mb-4 gap-3">
                        <PhoneCall className="select-none w-5 h-5 opacity-80 text-gray-200"/>
                        <span className="text-sm opacity-80">34 377 00 00</span>
                    </div>
                    <div className="flex items-center mb-4 gap-3">
                        <Mail className="select-none w-5 h-5 opacity-80 text-gray-200"/>
                        <span className="text-sm opacity-80">support@mousiq.com</span>
                    </div>
                </div>
            </div>
            <div
                className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white border-opacity-10 flex flex-col md:flex-row justify-between items-center">
                <div className="flex gap-4 mb-4 md:mb-0">
                    <img
                        className="select-none h-6 opacity-80 hover:opacity-100 transition-opacity duration-200"
                        src="/src/assets/payments/mastercard.png"
                        alt="Mastercard"
                    />
                    <img
                        className="select-none h-6 opacity-80 hover:opacity-100 transition-opacity duration-200"
                        src="/src/assets/payments/visa.png"
                        alt="Visa"
                    />
                </div>
                <div className="mb-4 md:mb-0">© 2026 Mousiq</div>
                <div className="flex gap-6 items-center">
                    <Link
                        to="/src/assets/Privacy Policy.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white no-underline text-sm opacity-80 hover:opacity-100 transition-opacity duration-200"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="/src/assets/Terms and Conditions.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white no-underline text-sm opacity-80 hover:opacity-100 transition-opacity duration-200"
                    >
                        Terms and Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;