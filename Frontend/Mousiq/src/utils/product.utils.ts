import {ConnectionType, GripType, SensorType} from "../types/product.types.ts";

export const getSensorTypeName = (sensorType: SensorType): string => {
    const names: Record<SensorType, string> = {
        [SensorType.OPTICAL]: 'Optical',
        [SensorType.LASER]: 'Laser',
    };
    return names[sensorType];
};

export const getConnectionTypeName = (connectionType: ConnectionType): string => {
    const names: Record<ConnectionType, string> = {
        [ConnectionType.USB]: 'USB',
        [ConnectionType.BLUETOOTH]: 'Bluetooth',
        [ConnectionType.USB_C]: 'USB-C',
        [ConnectionType.WIRELESS_2_4GHZ]: '2.4GHz',
        [ConnectionType.WIRELESS_2_4GHZ_BLUETOOTH]: '2.4GHz / bluetooth',
    };
    return names[connectionType];
};

export const getGripTypeName = (gripType: GripType): string => {
    const names: Record<GripType, string> = {
        [GripType.CLAW]: 'Claw',
        [GripType.PALM]: 'Palm',
        [GripType.FINGERTIP]: 'Fingertip',
    };
    return names[gripType];
};