package com.mousiq.common.dto.order;

import com.mousiq.common.enums.order.OrderStatus;
import lombok.*;

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
}
