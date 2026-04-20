import type { Brand } from './brand.types';

export const SensorType = {
    OPTICAL: 'OPTICAL',
    LASER: 'LASER'
} as const;

export type SensorType = typeof SensorType[keyof typeof SensorType];

export const ConnectionType = {
    USB: 'USB',
    USB_C: 'USB_C',
    BLUETOOTH: 'BLUETOOTH',
    WIRELESS_2_4GHZ: 'WIRELESS_2_4GHZ',
    WIRELESS_2_4GHZ_BLUETOOTH: 'WIRELESS_2_4GHZ_BLUETOOTH'
} as const;

export type ConnectionType = typeof ConnectionType[keyof typeof ConnectionType];

export const GripType = {
    PALM: 'PALM',
    CLAW: 'CLAW',
    FINGERTIP: 'FINGERTIP'
} as const;

export type GripType = typeof GripType[keyof typeof GripType];

export interface ProductSummary {
    id: string;
    name: string;
    slug: string;
    brandName: string;
    price: number;
    quantity: number;
    imageUrl: string;
    wireless: boolean;
    dpi: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    brand: Brand;
    description?: string;

    dpi: number;
    sensorType: SensorType;
    wireless: boolean;
    connectionType: ConnectionType;
    numberOfButtons: number;
    rgbLighting: boolean;
    weight: number;
    color: string;
    programmableButtons: boolean;
    pollingRate: number;
    gripType: GripType;
    batteryLife?: number;

    price: number;
    quantity: number;
    addedAt: string;

    imageUrl: string;
    imagePublicId: string;
}

export interface ProductRequest {
    name: string;
    brandName: string;
    description?: string;
    dpi: number;
    sensorType: SensorType;
    wireless: boolean;
    connectionType: ConnectionType;
    numberOfButtons: number;
    rgbLighting: boolean;
    weight: number;
    color: string;
    programmableButtons: boolean;
    pollingRate: number;
    gripType: GripType;
    batteryLife?: number;
    price: number;
    quantity: number;
}

export interface ProductFilterParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    name?: string;
    brandNames?: string[];
    wireless?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sensorType?: SensorType;
    connectionType?: ConnectionType;
    minDpi?: number;
    maxDpi?: number;
}