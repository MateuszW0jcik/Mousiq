package org.example.cartservice.cart.model.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ShoppingCartItemRequest(
        @NotNull(message = "productId can't be null")
        UUID productId,
        @NotNull(message = "productDTO can't be null")
        @Min(value = 1, message = "quantity must be greater then 0")
        Long quantity
) {
}
