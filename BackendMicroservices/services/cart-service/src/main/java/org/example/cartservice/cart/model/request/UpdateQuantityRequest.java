package org.example.cartservice.cart.model.request;

import jakarta.validation.constraints.Min;

public record UpdateQuantityRequest(
        @Min(value = 1, message = "quantity must be greater then 0")
        Long quantity
) {
}
