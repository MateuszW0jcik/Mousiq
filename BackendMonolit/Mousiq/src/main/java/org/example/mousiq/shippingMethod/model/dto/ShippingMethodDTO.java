package org.example.mousiq.shippingMethod.model.dto;

import lombok.*;
import org.example.mousiq.shippingMethod.model.entity.ShippingMethod;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingMethodDTO {
    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;

    public ShippingMethodDTO(ShippingMethod shippingMethod) {
        this.id = shippingMethod.getId();
        this.name = shippingMethod.getName();
        this.description = shippingMethod.getDescription();
        this.price = shippingMethod.getPrice();
    }
}