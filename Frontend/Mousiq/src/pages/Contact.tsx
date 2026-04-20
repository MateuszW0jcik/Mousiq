import React, {useEffect, useState} from 'react';
import {MapPin, PhoneCall, Mail} from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {Link, useNavigate} from "react-router-dom";
import messageService from "../services/message.service.ts";
import {useAuth} from "../contexts/AuthContext.jsx";
import {parseApiError, getErrorMessage} from "../services/api.service.js";

interface SubmitStatus {
    type: 'success' | 'error';
    message: string;
}

const Contact: React.FC = () => {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/account/contact', {replace: true});
        }
    }, [isAuthenticated, navigate]);

    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message.trim()) {
            setSubmitStatus({type: 'error', message: 'Message is required'});
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await messageService.createMessage({
                content: message.trim(),
                name: name.trim(),
                email: email.trim()
            });

            setSubmitStatus({type: 'success', message: 'Message sent successfully! We will get back to you soon.'});
            setMessage('');
            setName('');
            setEmail('');
        } catch (error) {
            const apiError = parseApiError(error, 'Failed to send message');
            setSubmitStatus({
                type: 'error',
                message: getErrorMessage(apiError)
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4 font-sans">
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        Home &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">Contact Us</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center m-10">
                    <div className="flex flex-col items-center gap-3">
                        <MapPin className="w-10 h-10 text-blue-600"/>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">Our Store</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                123 Main Street,<br/>
                                Anytown, USA
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <Mail className="w-10 h-10 text-blue-600"/>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">Email</h4>
                            <p className="text-sm text-gray-600">support@mousiq.com</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <PhoneCall className="w-10 h-10 text-blue-600"/>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">Phone</h4>
                            <p className="text-sm text-gray-600">34 377 00 00</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl p-5 mx-auto items-start">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Get in Touch</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Have a question about our gaming mice? Need help choosing the perfect mouse for your setup?
                            Want to inquire about product availability or shipping? Our team of gaming gear experts is
                            here to help! Fill out the form and we'll respond within 24 hours.
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed mt-4">
                            For urgent matters or order-related questions, please don't hesitate to call us directly
                            during business hours (Mon-Fri, 9 AM - 6 PM CET).
                        </p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-xs text-gray-600 mb-1">Your Name
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                required
                                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-xs text-gray-600 mb-1">Email Address
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="message" className="text-xs text-gray-600 mb-2">Message
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={5}
                                maxLength={1000}
                                required
                                value={message}
                                onChange={handleMessageChange}
                                placeholder="Tell us how we can help you..."
                                disabled={isSubmitting}
                                className={`p-3 border border-gray-300 rounded mb-2 text-sm resize-none min-h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    message.trim() ? 'border-l-4 border-l-blue-500' : ''
                                }`}
                            />
                            <div className="mt-1 text-xs text-gray-500">
                                {message.length}/1000 characters
                            </div>
                        </div>

                        {submitStatus && (
                            <div className={`p-3 rounded text-sm ${
                                submitStatus.type === 'success'
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                                {submitStatus.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !message.trim()}
                            className={`bg-blue-600 text-white border-none py-2.5 px-5 rounded cursor-pointer text-sm transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                                isSubmitting ? 'opacity-50' : ''
                            }`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Contact;