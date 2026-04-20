import React, {useState, useEffect} from 'react';
import Slider from "rc-slider";

interface DPIFilterProps {
    expanded: boolean;
    toggleFilter: () => void;
    minDpi: number;
    maxDpi: number;
    dpiRange: {
        min: number;
        max: number;
    }
    updateFilters: (minDpi: number, maxDpi: number) => void;
}

const DPIFilter: React.FC<DPIFilterProps> = ({
                                                 expanded,
                                                 toggleFilter,
                                                 minDpi,
                                                 maxDpi,
                                                 dpiRange,
                                                 updateFilters
                                             }) => {
    const [localDpiRange, setLocalDpiRange] = useState<[number, number]>([minDpi, maxDpi]);

    useEffect(() => {
        setLocalDpiRange([minDpi, maxDpi]);
    }, [minDpi, maxDpi]);

    const handleRangeChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setLocalDpiRange(values as [number, number]);
        }
    };

    const applyDpiFilter = () => {
        updateFilters(localDpiRange[0], localDpiRange[1]);
    };

    const handleMinInputChange = (value: string) => {
        const numValue = parseInt(value, 10) || 0;
        setLocalDpiRange([numValue, localDpiRange[1]]);
    };

    const handleMaxInputChange = (value: string) => {
        const numValue = parseInt(value, 10) || 0;
        setLocalDpiRange([localDpiRange[0], numValue]);
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">Dpi</span>
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
                            value={localDpiRange[0]}
                            onChange={(e) => handleMinInputChange(e.target.value)}
                            onBlur={applyDpiFilter}
                            min={dpiRange.min}
                            max={dpiRange.max}
                        />
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Max"
                            value={localDpiRange[1]}
                            onChange={(e) => handleMaxInputChange(e.target.value)}
                            onBlur={applyDpiFilter}
                            min={dpiRange.min}
                            max={dpiRange.max}
                        />
                    </div>
                    <div className="py-4 px-1">
                        <Slider
                            range
                            min={dpiRange.min}
                            max={dpiRange.max}
                            value={localDpiRange}
                            onChange={handleRangeChange}
                            onChangeComplete={applyDpiFilter}
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

export default DPIFilter;