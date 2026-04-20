import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {Link} from "react-router-dom";
import aboutUsBanner from "../assets/banners/about_us.png";

const About = () => {
    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4">
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        Home &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">About Us</span>
                </div>

                <div className="flex flex-col items-center gap-8 mb-10">
                    <div className="w-full max-w-screen-xl px-5">
                        <img
                            className="w-full object-cover rounded-lg"
                            src={aboutUsBanner}
                            alt="Mousiq - Premium Gaming Mice Store"
                        />
                    </div>

                    <div className="w-full max-w-6xl px-4 text-gray-700">
                        <p className="text-base leading-relaxed mb-6">
                            <span className="font-semibold text-gray-800">Mousiq</span> is your ultimate destination for premium gaming and professional mice. Our mission is captured in our motto: <span className="italic">"Precision in Every Click,"</span> reflecting our commitment to providing top-quality peripherals that enhance your gaming experience and boost productivity.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">What Makes Mousiq Special?</h3>
                        <p className="text-base leading-relaxed mb-6">
                            The name <span className="font-semibold">"Mousiq"</span> combines "mouse" with a unique twist, symbolizing our dedication to offering innovative and high-performance mice for gamers, designers, and professionals alike. We believe that the right mouse can transform your entire workflow and gaming experience.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">Why Choose Mousiq?</h3>

                        <ul className="list-disc list-inside space-y-3 text-base leading-relaxed">
                            <li>
                                <span className="font-semibold">Premium Selection:</span> We offer only the best gaming and professional mice from renowned brands, ensuring top-tier performance and durability.
                            </li>
                            <li>
                                <span className="font-semibold">Expert Guidance:</span> Our team consists of gaming enthusiasts and tech experts ready to help you find the perfect mouse for your needs.
                            </li>
                            <li>
                                <span className="font-semibold">Competitive Pricing:</span> Get the best deals on high-end mice without compromising on quality or authenticity.
                            </li>
                            <li>
                                <span className="font-semibold">Fast Shipping:</span> Quick and reliable delivery to get your new mouse into your hands as soon as possible.
                            </li>
                            <li>
                                <span className="font-semibold">Customer Satisfaction:</span> Our priority is your satisfaction, backed by excellent customer service and hassle-free returns.
                            </li>
                            <li>
                                <span className="font-semibold">Latest Technology:</span> Stay ahead with the newest sensor technology, wireless connectivity, and ergonomic designs.
                            </li>
                        </ul>

                        <p className="text-base leading-relaxed mt-8">
                            Whether you're a competitive esports player, creative professional, or simply looking for a comfortable daily-use mouse, Mousiq has the perfect solution for you. Join thousands of satisfied customers who have upgraded their setup with Mousiq.
                        </p>
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default About;