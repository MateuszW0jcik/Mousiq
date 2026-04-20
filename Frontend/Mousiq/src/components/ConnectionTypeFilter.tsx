import React from 'react';
import {ConnectionType} from '../types/product.types';

interface ConnectionTypeFilterProps {
    expanded: boolean;
    toggleFilter: () => void;
    selectedConnectionTypes: ConnectionType[];
    updateFilters: (key: string, value: string | null) => void;
}

const connectionTypeOptions = [
    {value: ConnectionType.USB, label: 'USB'},
    {value: ConnectionType.USB_C, label: 'USB-C'},
    {value: ConnectionType.BLUETOOTH, label: 'Bluetooth'},
    {value: ConnectionType.WIRELESS_2_4GHZ, label: '2.4GHz Wireless'}
];

const ConnectionTypeFilter: React.FC<ConnectionTypeFilterProps> = ({
                                                                       expanded,
                                                                       toggleFilter,
                                                                       selectedConnectionTypes,
                                                                       updateFilters
                                                                   }) => {
    const handleConnectionTypeChange = (connectionType: ConnectionType) => {
        const current = selectedConnectionTypes || [];
        let updated: ConnectionType[];

        if (current.includes(connectionType)) {
            updated = current.filter(type => type !== connectionType);
        } else {
            updated = [...current, connectionType];
        }

        if (updated.length === 0) {
            updateFilters('connectionType', null);
        } else {
            updateFilters('connectionType', updated.join(','));
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">Connection Type</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${
                    expanded ? 'rotate-[-135deg]' : 'rotate-45'
                } transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    {connectionTypeOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={selectedConnectionTypes.includes(option.value)}
                                onChange={() => handleConnectionTypeChange(option.value)}
                            />
                            <span className="text-sm text-gray-800 flex-grow">{option.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </>
    );
};

export default ConnectionTypeFilter;