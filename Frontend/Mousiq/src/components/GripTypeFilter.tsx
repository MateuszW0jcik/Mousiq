import React from 'react';
import {GripType} from '../types/product.types';

interface GripTypeFilterProps {
    expanded: boolean;
    toggleFilter: () => void;
    selectedGripTypes: GripType[];
    updateFilters: (key: string, value: string | null) => void;
}

const gripTypeOptions = [
    {value: GripType.PALM, label: 'Palm Grip'},
    {value: GripType.CLAW, label: 'Claw Grip'},
    {value: GripType.FINGERTIP, label: 'Fingertip Grip'}
];

const GripTypeFilter: React.FC<GripTypeFilterProps> = ({
                                                           expanded,
                                                           toggleFilter,
                                                           selectedGripTypes,
                                                           updateFilters
                                                       }) => {
    const handleGripTypeChange = (gripType: GripType) => {
        const current = selectedGripTypes || [];
        let updated: GripType[];

        if (current.includes(gripType)) {
            updated = current.filter(type => type !== gripType);
        } else {
            updated = [...current, gripType];
        }

        if (updated.length === 0) {
            updateFilters('gripType', null);
        } else {
            updateFilters('gripType', updated.join(','));
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">Grip Type</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${
                    expanded ? 'rotate-[-135deg]' : 'rotate-45'
                } transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    {gripTypeOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={selectedGripTypes.includes(option.value)}
                                onChange={() => handleGripTypeChange(option.value)}
                            />
                            <span className="text-sm text-gray-800 flex-grow">{option.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
};

export default GripTypeFilter;