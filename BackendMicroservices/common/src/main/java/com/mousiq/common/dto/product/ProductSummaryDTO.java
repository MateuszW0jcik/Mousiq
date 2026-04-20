package com.mousiq.common.dto.product;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummaryDTO {
    private UUID id;
    private String name;
    private String slug;
    private String brandName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private Boolean wireless;
    private Integer dpi;
}
