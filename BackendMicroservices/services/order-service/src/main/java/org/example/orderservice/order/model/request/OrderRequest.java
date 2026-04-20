package org.example.orderservice.order.model.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OrderRequest(
        @NotNull(message = "Address id can't be null")
        UUID addressId,
        @NotNull(message = "Contact id can't be null")
        UUID contactId,
        @NotNull(message = "Payment method id can't be null")
        UUID paymentMethodId,
        @NotNull(message = "Shipping method id can't be null")
        UUID shippingMethodId
) {
}
