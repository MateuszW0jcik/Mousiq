package com.mousiq.common.dto.order;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderedItemDTO {
    private String productName;
    private String brandName;
    private BigDecimal price;
    private Long quantity;
    private String productImageUrl;
}
