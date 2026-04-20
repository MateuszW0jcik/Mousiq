import {OrderStatus} from '../types/order.types';

export const getOrderStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
        [OrderStatus.PENDING]: 'Pending',
        [OrderStatus.PAYMENT_FAILED]: 'Payment Failed',
        [OrderStatus.PAID]: 'Paid',
        [OrderStatus.PROCESSING]: 'Processing',
        [OrderStatus.SHIPPED]: 'Shipped',
        [OrderStatus.DELIVERED]: 'Delivered',
        [OrderStatus.CANCELLED]: 'Cancelled',
        [OrderStatus.REFUSED]: 'Refused',
        [OrderStatus.PARTIALLY_REFUSED]: 'Partially Refused',
    };
    return labels[status];
};

export const getOrderStatusColor = (status: OrderStatus): string => {
    const colors: Record<OrderStatus, string> = {
        [OrderStatus.PENDING]: 'orange',
        [OrderStatus.PAYMENT_FAILED]: 'red',
        [OrderStatus.PAID]: 'green',
        [OrderStatus.PROCESSING]: 'blue',
        [OrderStatus.SHIPPED]: 'purple',
        [OrderStatus.DELIVERED]: 'green',
        [OrderStatus.CANCELLED]: 'red',
        [OrderStatus.REFUSED]: 'red',
        [OrderStatus.PARTIALLY_REFUSED]: 'yellow',
    };
    return colors[status];
};