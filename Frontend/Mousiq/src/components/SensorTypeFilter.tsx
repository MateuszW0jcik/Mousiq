import React from 'react';
import {SensorType} from '../types/product.types';

interface SensorTypeFilterProps {
    expanded: boolean;
    toggleFilter: () => void;
    selectedSensorTypes: SensorType[];
    updateFilters: (key: string, value: string | null) => void;
}

const sensorTypeOptions = [
    {value: SensorType.OPTICAL, label: 'Optical'},
    {value: SensorType.LASER, label: 'Laser'}
];

const SensorTypeFilter: React.FC<SensorTypeFilterProps> = ({
                                                               expanded,
                                                               toggleFilter,
                                                               selectedSensorTypes,
                                                               updateFilters
                                                           }) => {
    const handleSensorTypeChange = (sensorType: SensorType) => {
        const current = selectedSensorTypes || [];
        let updated: SensorType[];

        if (current.includes(sensorType)) {
            updated = current.filter(type => type !== sensorType);
        } else {
            updated = [...current, sensorType];
        }

        if (updated.length === 0) {
            updateFilters('sensorType', null);
        } else {
            updateFilters('sensorType', updated.join(','));
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">Sensor Type</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${
                    expanded ? 'rotate-[-135deg]' : 'rotate-45'
                } transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    {sensorTypeOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={selectedSensorTypes.includes(option.value)}
                                onChange={() => handleSensorTypeChange(option.value)}
                            />
                            <span className="text-sm text-gray-800 flex-grow">{option.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
};

export default SensorTypeFilter;