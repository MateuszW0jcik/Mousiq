package org.example.mousiq.order.model.dto;

import lombok.*;
import org.example.mousiq.order.model.entity.Order;
import org.example.mousiq.order.model.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

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

    public OrderDTO(Order order) {
        this.orderNumber = order.getOrderNumber();
        this.orderedItems = order.getEmail() != null
                ? order.getItems().stream()
                .map(OrderedItemDTO::new)
                .collect(Collectors.toSet())
                : Set.of();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
        this.country = order.getCountry();
        this.postalCode = order.getPostalCode();
        this.city = order.getCity();
        this.street = order.getStreet();
        this.streetNumber = order.getStreetNumber();
        this.email = order.getEmail();
        this.phoneNumber = order.getPhoneNumber();
        this.createdAt = order.getCreatedAt();
    }
}
