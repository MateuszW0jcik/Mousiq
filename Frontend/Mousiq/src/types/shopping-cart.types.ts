import type {ProductSummary} from './product.types';

export interface ShoppingCartItem {
    id: string;
    product: ProductSummary;
    quantity: number;
}

export interface ShoppingCartItemRequest {
    productId: string;
    quantity: number;
}

export interface UpdateQuantityRequest {
    quantity: number;
}