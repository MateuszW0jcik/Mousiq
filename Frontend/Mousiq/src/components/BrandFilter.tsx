import React from 'react';
import type {Brand} from '../types/brand.types';

interface BrandFilterProps {
    expanded: boolean;
    toggleFilter: () => void;
    brands: Brand[];
    selectedBrandNames: string[];
    updateFilters: (key: string, value: string | null) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({
                                                     expanded,
                                                     toggleFilter,
                                                     brands,
                                                     selectedBrandNames,
                                                     updateFilters
                                                 }) => {
    const handleBrandChange = (brandName: string) => {
        const current = selectedBrandNames || [];
        let updated: string[];

        if (current.includes(brandName)) {
            updated = current.filter(name => name !== brandName);
        } else {
            updated = [...current, brandName];
        }

        if (updated.length === 0) {
            updateFilters('brandNames', null);
        } else {
            updateFilters('brandNames', updated.join(','));
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">Brand</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${
                    expanded ? 'rotate-[-135deg]' : 'rotate-45'
                } transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={selectedBrandNames.includes(brand.name)}
                                onChange={() => handleBrandChange(brand.name)}
                            />
                            <span className="text-sm text-gray-800 flex-grow">{brand.name}</span>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
};

export default BrandFilter;