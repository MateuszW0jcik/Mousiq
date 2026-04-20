package org.example.mousiq.shippingMethod.model.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ShippingMethodRequest(
        @NotBlank(message = "Name can't be empty")
        String name,
        @NotBlank(message = "description can't be empty")
        String description,
        @NotNull(message = "Price can't be null")
        @DecimalMin(value = "0.0", message = "Price must be greater or equal to 0")
        BigDecimal price
){}
