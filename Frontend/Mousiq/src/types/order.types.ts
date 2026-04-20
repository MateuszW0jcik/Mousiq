export const OrderStatus = {
    PENDING: 'PENDING',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
    PAID: 'PAID',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
    REFUSED: 'REFUSED',
    PARTIALLY_REFUSED: 'PARTIALLY_REFUSED',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderedItem {
    productName: string;
    brandName: string;
    price: number;
    quantity: number;
    productImageUrl: string;
}

export interface OrderSummary {
    id: string;
    orderNumber: string;
    totalPrice: number;
    status: OrderStatus;
    owner: string;
    createdAt: string;
    itemCount: number;
}

export interface Order {
    orderNumber: string;
    orderedItems: OrderedItem[];
    totalPrice: number;
    status: OrderStatus;
    country: string;
    postalCode: string;
    city: string;
    street: string;
    streetNumber: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
}

export interface OrderRequest {
    addressId: string;
    contactId: string;
    paymentMethodId: string;
    shippingMethodId: string;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

export interface OrderListParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface AdminOrderListParams extends OrderListParams {
    ownerName?: string;
}