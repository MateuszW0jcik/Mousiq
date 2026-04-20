package org.example.productservice.product.model.request;

import com.mousiq.common.enums.product.ConnectionType;
import com.mousiq.common.enums.product.GripType;
import com.mousiq.common.enums.product.SensorType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        String name,

        @NotBlank(message = "Brand name is required")
        String brandName,

        String description,

        @Min(value = 100, message = "DPI must be at least 100")
        @Max(value = 30000, message = "DPI cannot exceed 30000")
        Integer dpi,

        SensorType sensorType,

        Boolean wireless,

        ConnectionType connectionType,

        @Min(value = 2, message = "Must have at least 2 buttons")
        @Max(value = 20, message = "Cannot have more than 20 buttons")
        Integer numberOfButtons,

        Boolean rgbLighting,

        @Min(value = 20, message = "Weight must be at least 20g")
        @Max(value = 500, message = "Weight cannot exceed 500g")
        Integer weight,

        String color,

        Boolean programmableButtons,

        Integer pollingRate,

        GripType gripType,

        @Min(value = 0, message = "Battery life cannot be negative")
        Integer batteryLife,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        BigDecimal price,

        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity cannot be negative")
        Integer quantity
) {}
