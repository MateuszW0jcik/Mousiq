import React from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {Link} from "react-router-dom";

interface Promise {
    title: string;
    description: string;
}

const OurPromises: React.FC = () => {
    const promisesData: Promise[] = [
        {
            title: "Authentic Products Only",
            description: "We guarantee 100% authentic gaming mice from authorized distributors. Every product comes with manufacturer warranty and original packaging. No counterfeits, no compromises on quality."
        },
        {
            title: "Expert Guidance",
            description: "Our team consists of passionate gamers and tech enthusiasts who understand your needs. We provide honest recommendations based on your gaming style, grip preference, and budget to help you find your perfect match."
        },
        {
            title: "Competitive Pricing",
            description: "We offer the best prices on premium gaming mice without hidden fees. Regular promotions, bundle deals, and price-match guarantees ensure you're getting excellent value for your investment."
        },
        {
            title: "Fast & Secure Shipping",
            description: "Orders are processed within 24 hours with secure, tracked shipping. Free delivery on orders over 200 PLN. Your gaming gear arrives safely and quickly, ready to dominate the competition."
        },
        {
            title: "30-Day Satisfaction Guarantee",
            description: "Try your new mouse risk-free for 30 days. If it doesn't meet your expectations, return it hassle-free for a full refund. Your satisfaction is our priority, and we stand behind every product we sell."
        },
    ];

    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4 font-sans">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        Home &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">Our Promises</span>
                </div>

                {/* Content Section */}
                <div className="flex flex-col items-center gap-8 mb-10 text-gray-700">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                        Our Commitment to You
                    </h1>
                    <p className="text-base leading-relaxed max-w-3xl text-center mb-6">
                        At Mousiq, we're more than just a store - we're your trusted partner in gaming excellence.
                        These are the promises we make to every customer, ensuring you have the best shopping experience
                        and find the perfect gaming mouse to elevate your performance.
                    </p>

                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                        {promisesData.map((promise, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {promise.title}
                                </h3>
                                <p className="text-base leading-relaxed">
                                    {promise.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100 max-w-3xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                            Ready to Find Your Perfect Mouse?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 text-center">
                            Browse our extensive collection of gaming mice and experience the Mousiq difference.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/products"
                                className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Shop Now
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-block bg-white text-blue-600 py-2 px-6 rounded border border-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default OurPromises;