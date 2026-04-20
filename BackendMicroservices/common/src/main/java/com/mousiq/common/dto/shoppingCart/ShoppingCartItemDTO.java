package com.mousiq.common.dto.shoppingCart;

import com.mousiq.common.dto.product.ProductSummaryDTO;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingCartItemDTO {
    private UUID id;
    private ProductSummaryDTO product;
    private Long quantity;
}
