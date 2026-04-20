import React from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import faqBanner from "../assets/banners/FAQ.png";
import {Link} from "react-router-dom";

interface FaqItem {
    question: string;
    answer: string;
}

const Faq: React.FC = () => {
    const faqData: FaqItem[] = [
        {
            question: "What types of gaming mice do you offer?",
            answer: "We offer a wide range of gaming mice including wired, wireless, ultra-lightweight, ergonomic, and ambidextrous designs. Our collection features mice with various sensor types (optical and laser), DPI ranges from 800 to 30,000+, and different grip styles to suit every gamer's preference."
        },
        {
            question: "How do I choose the right mouse for my gaming style?",
            answer: "Consider your grip style (palm, claw, or fingertip), preferred weight, DPI requirements, and game genre. FPS players often prefer lightweight mice with high DPI, while MOBA players might prioritize button customization. Our customer support team is always ready to help you find the perfect match for your needs."
        },
        {
            question: "What is DPI and why does it matter?",
            answer: "DPI (Dots Per Inch) measures mouse sensitivity - how far the cursor moves for each inch the mouse travels. Higher DPI means faster cursor movement. Most gaming mice offer adjustable DPI settings, allowing you to switch between sensitivities on-the-fly for different gaming scenarios or tasks."
        },
        {
            question: "Do you offer warranty on your products?",
            answer: "Yes! All mice purchased from Mousiq come with manufacturer warranty ranging from 1 to 3 years depending on the brand and model. We also offer 30-day hassle-free returns if you're not completely satisfied with your purchase."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping within Poland takes 2-3 business days. We also offer express next-day delivery for urgent orders. International shipping to EU countries typically takes 5-7 business days. All orders are shipped with tracking numbers."
        },
        {
            question: "Can I test the mouse before buying?",
            answer: "While we don't offer in-store testing, we provide detailed specifications, user reviews, and comparison tools on our website. Plus, our 30-day return policy allows you to try the mouse risk-free. If it doesn't meet your expectations, you can return it for a full refund."
        },
        {
            question: "What's the difference between wireless and wired gaming mice?",
            answer: "Modern wireless gaming mice offer virtually no latency and are on par with wired mice in terms of performance. Wired mice never need charging and are slightly lighter. Wireless mice offer freedom of movement and cleaner desk setup. We stock both premium wireless and wired options from top brands."
        },
        {
            question: "Do you sell replacement parts or accessories?",
            answer: "Yes! We offer mouse feet (skates), replacement cables, grips, and other accessories for popular gaming mice models. Check our accessories section or contact support if you need a specific replacement part."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and cash on delivery for orders within Poland. All transactions are secured with industry-standard encryption."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can track your package directly through our website by logging into your account or using the tracking link provided in the shipping confirmation email."
        }
    ];

    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4">
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        Home &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">FAQ</span>
                </div>

                <div className="flex flex-col items-center gap-8 mb-10">
                    <div className="w-full max-w-screen-xl px-5">
                        <img
                            className="w-full object-cover rounded-lg"
                            src={faqBanner}
                            alt="Mousiq Frequently Asked Questions"
                        />
                    </div>

                    <div className="w-full max-w-3xl px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                            Frequently Asked Questions
                        </h2>

                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`pb-5 mb-8 ${index < faqData.length - 1 ? 'border-b border-gray-200' : ''}`}
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 leading-snug">
                                    {faq.question}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}

                        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Still have questions?
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Our support team is here to help! Feel free to reach out via our contact page or email us directly.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-block bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Faq;