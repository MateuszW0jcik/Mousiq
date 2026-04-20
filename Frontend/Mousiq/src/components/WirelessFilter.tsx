import React from 'react';

interface WirelessFilterProps {
    expanded: boolean;
    toggleFilter: () => void;
    selectedWireless: boolean | null;
    updateFilters: (key: string, value: string | null) => void;
}

const WirelessFilter: React.FC<WirelessFilterProps> = ({
                                                           expanded,
                                                           toggleFilter,
                                                           selectedWireless,
                                                           updateFilters
                                                       }) => {
    const handleWirelessChange = (isWireless: boolean) => {
        if (selectedWireless === isWireless) {
            updateFilters('wireless', null);
        } else {
            updateFilters('wireless', isWireless.toString());
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">Wireless</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${
                    expanded ? 'rotate-[-135deg]' : 'rotate-45'
                } transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="wireless"
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedWireless === true}
                            onChange={() => handleWirelessChange(true)}
                        />
                        <span className="text-sm text-gray-800 flex-grow">Wireless</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="wireless"
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedWireless === false}
                            onChange={() => handleWirelessChange(false)}
                        />
                        <span className="text-sm text-gray-800 flex-grow">Wired</span>
                    </label>
                </div>
            )}
        </>
    );
};

export default WirelessFilter;