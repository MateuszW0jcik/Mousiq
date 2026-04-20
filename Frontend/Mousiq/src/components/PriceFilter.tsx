import React, {useState, useEffect} from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface PriceFilterProps {
    expanded: boolean;
    toggleFilter: () => void;
    minPrice: number;
    maxPrice: number;
    priceRange: {
        min: number;
        max: number;
    };
    updateFilters: (minPrice: number, maxPrice: number) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
                                                     expanded,
                                                     toggleFilter,
                                                     minPrice,
                                                     maxPrice,
                                                     priceRange,
                                                     updateFilters
                                                 }) => {
    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

    useEffect(() => {
        setLocalPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    const handleRangeChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setLocalPriceRange(values as [number, number]);
        }
    };

    const applyPriceFilter = () => {
        updateFilters(localPriceRange[0], localPriceRange[1]);
    };

    const handleMinInputChange = (value: string) => {
        const numValue = parseInt(value, 10) || 0;
        setLocalPriceRange([numValue, localPriceRange[1]]);
    };

    const handleMaxInputChange = (value: string) => {
        const numValue = parseInt(value, 10) || 0;
        setLocalPriceRange([localPriceRange[0], numValue]);
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">Price</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${
                    expanded ? 'rotate-[-135deg]' : 'rotate-45'
                } transition-transform`}></i>
            </div>
            {expanded && (
                <div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Min"
                            value={localPriceRange[0]}
                            onChange={(e) => handleMinInputChange(e.target.value)}
                            onBlur={applyPriceFilter}
                            min={priceRange.min}
                            max={priceRange.max}
                        />
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Max"
                            value={localPriceRange[1]}
                            onChange={(e) => handleMaxInputChange(e.target.value)}
                            onBlur={applyPriceFilter}
                            min={priceRange.min}
                            max={priceRange.max}
                        />
                    </div>
                    <div className="py-4 px-1">
                        <Slider
                            range
                            min={priceRange.min}
                            max={priceRange.max}
                            value={localPriceRange}
                            onChange={handleRangeChange}
                            onChangeComplete={applyPriceFilter}
                            styles={{
                                track: {
                                    backgroundColor: '#3b82f6'
                                },
                                rail: {
                                    backgroundColor: '#e5e7eb',
                                    height: 4
                                },
                                handle: {
                                    backgroundColor: 'white',
                                    borderColor: '#ccc',
                                    height: 20,
                                    width: 20,
                                    marginTop: -8,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    opacity: 1
                                }
                            }}
                            pushable={10}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PriceFilter;