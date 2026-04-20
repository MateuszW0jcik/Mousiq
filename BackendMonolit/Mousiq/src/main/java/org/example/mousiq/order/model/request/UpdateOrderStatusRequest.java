package org.example.mousiq.order.model.request;

import jakarta.validation.constraints.NotNull;
import org.example.mousiq.order.model.entity.OrderStatus;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Order status is required")
        OrderStatus status
) {}
