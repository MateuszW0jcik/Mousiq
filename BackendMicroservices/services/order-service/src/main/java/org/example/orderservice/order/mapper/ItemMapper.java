package org.example.orderservice.order.mapper;

import com.mousiq.common.dto.order.OrderedItemDTO;
import org.example.orderservice.order.model.entity.OrderItem;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {
    public OrderedItemDTO toDTO(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }

        return OrderedItemDTO.builder()
                .productName(orderItem.getProductName())
                .brandName(orderItem.getBrandName())
                .price(orderItem.getPrice())
                .quantity(orderItem.getQuantity())
                .productImageUrl(orderItem.getProductImageUrl()).build();
    }
}
