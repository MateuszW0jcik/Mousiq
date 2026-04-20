package com.mousiq.common.dto.order;

import com.mousiq.common.enums.order.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private String orderNumber;
    private Set<OrderedItemDTO> orderedItems;
    private BigDecimal totalPrice;
    private OrderStatus status;

    private String country;
    private String postalCode;
    private String city;
    private String street;
    private String streetNumber;

    private String email;
    private String phoneNumber;

    private Instant createdAt;
}
