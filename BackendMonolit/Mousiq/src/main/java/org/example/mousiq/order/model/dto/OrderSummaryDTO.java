package org.example.mousiq.order.model.dto;

import lombok.*;
import org.example.mousiq.order.model.entity.Order;
import org.example.mousiq.order.model.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSummaryDTO {
    private UUID id;
    private String orderNumber;
    private BigDecimal totalPrice;
    private OrderStatus status;
    private String owner;
    private Instant createdAt;
    private Integer itemCount;

    public OrderSummaryDTO(Order order) {
        this.id = order.getId();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
        this.owner = order.getOwner();
        this.createdAt = order.getCreatedAt();
        this.itemCount = order.getItems() != null ? order.getItems().size() : 0;
    }
}
