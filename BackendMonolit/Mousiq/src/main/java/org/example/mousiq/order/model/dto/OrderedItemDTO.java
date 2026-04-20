package org.example.mousiq.order.model.dto;

import lombok.*;
import org.example.mousiq.order.model.entity.OrderedItem;

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

    public OrderedItemDTO(OrderedItem orderedItem) {
        this.productName = orderedItem.getProductName();
        this.brandName = orderedItem.getBrandName();
        this.price = orderedItem.getPrice();
        this.quantity = orderedItem.getQuantity();
        this.productImageUrl = orderedItem.getProductImageUrl();
    }
}
