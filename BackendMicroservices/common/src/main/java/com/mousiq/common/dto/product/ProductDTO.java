package com.mousiq.common.dto.product;

import com.mousiq.common.enums.product.ConnectionType;
import com.mousiq.common.enums.product.GripType;
import com.mousiq.common.enums.product.SensorType;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private UUID id;
    private String name;
    private String slug;
    private BrandDTO brand;
    private String description;

    private Integer dpi;
    private SensorType sensorType;
    private Boolean wireless;
    private ConnectionType connectionType;
    private Integer numberOfButtons;
    private Boolean rgbLighting;
    private Integer weight;
    private String color;
    private Boolean programmableButtons;
    private Integer pollingRate;
    private GripType gripType;
    private Integer batteryLife;

    private BigDecimal price;
    private Integer quantity;
    private Instant addedAt;

    private String imageUrl;
    private String imagePublicId;
}
