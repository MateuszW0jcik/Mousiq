import React, {useState} from 'react';
import messageService from "../../services/message.service.ts";
import {parseApiError, getErrorMessage} from "../../services/api.service.js";
import {useAuth} from "../../contexts/AuthContext.tsx";

interface SubmitStatus {
    type: 'success' | 'error';
    message: string;
}

const AccountContact: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

    const {user} = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message.trim()) {
            setSubmitStatus({ type: 'error', message: 'Message is required' });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await messageService.createMessage({
                content: message.trim(),
                name: user?.firstName + ' ' + user?.lastName,
                email: user?.email,
            });

            setSubmitStatus({
                type: 'success',
                message: 'Message sent successfully! Our team will respond within 24 hours.'
            });
            setMessage('');
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

    return (
        <div className="w-full max-w-6xl p-5 font-sans">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Support</h3>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                <div className="mb-5 w-full max-w-md flex flex-col">
                    <div className="mb-8">
                        <p className="text-sm text-gray-600 m-0">
                            Have a question about your order, product recommendations, or need technical support?
                            Send us a message and our gaming gear experts will get back to you as soon as possible.
                            For urgent matters, please call us at 34 377 00 00 during business hours.
                        </p>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Contact Info</h4>
                            <p className="text-xs text-gray-600 mb-1">
                                <strong>Email:</strong> support@mousiq.com
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                                <strong>Phone:</strong> 34 377 00 00
                            </p>
                            <p className="text-xs text-gray-600">
                                <strong>Hours:</strong> Mon-Fri, 9 AM - 6 PM CET
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-5 w-full max-w-md flex flex-col">
                    <label className="text-xs text-gray-600 mb-2" htmlFor="message">
                        Your Message
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
                        className={`p-3 border border-gray-300 rounded mb-4 text-sm resize-none min-h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            message.trim() ? 'border-l-4 border-l-blue-500' : ''
                        }`}
                        placeholder="Describe your question or issue in detail..."
                        disabled={isSubmitting}
                    />

                    {submitStatus && (
                        <div className={`mb-4 p-3 rounded text-sm ${
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

                    <div className="mt-2 text-xs text-gray-500">
                        {message.length}/1000 characters
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AccountContact;