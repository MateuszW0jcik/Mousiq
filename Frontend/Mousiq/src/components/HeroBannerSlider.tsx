import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';

const HeroBannerSlider: React.FC = () => {
    const [currentBanner, setCurrentBanner] = useState(0);
    const totalBanners = 3;
    const intervalRef = useRef<number | null>(null);

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % totalBanners);
        }, 10000);
    };

    useEffect(() => {
        startInterval();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleDotClick = (index: number) => {
        setCurrentBanner(index);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        startInterval();
    };

    return (
        <section className="relative overflow-hidden mx-auto z-10" aria-label="Main banners">
            <div
                className="flex transition-transform duration-500 ease-in-out w-full"
                style={{
                    transform: `translateX(-${currentBanner * 33.333}%)`,
                    width: '300%'
                }}
            >
                {[1, 2, 3].map((bannerNum, index) => (
                    <div key={index} className="flex-none w-1/3 min-w-1/3">
                        <Link to="/products">
                            <img
                                src={`/src/assets/banners/banner${bannerNum}.jpg`}
                                alt={`Banner ${bannerNum}`}
                                className="w-screen block object-cover select-none"
                                style={{aspectRatio: '21/7'}}
                                draggable={false}
                            />
                        </Link>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex justify-center gap-2.5">
                {[0, 1, 2].map((index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full border-none cursor-pointer transition-colors duration-300 ${
                            currentBanner === index ? 'bg-white' : 'bg-gray-500'
                        }`}
                        role="tab"
                        aria-selected={currentBanner === index}
                        aria-label={`Banner ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroBannerSlider;