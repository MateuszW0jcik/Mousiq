package com.mousiq.common.dto.shippingMethod;

import lombok.*;

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
}
