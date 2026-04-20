package org.example.orderservice.order.mapper;

import com.mousiq.common.dto.order.OrderDTO;
import com.mousiq.common.dto.order.OrderSummaryDTO;
import com.mousiq.common.dto.order.OrderedItemDTO;
import lombok.RequiredArgsConstructor;
import org.example.orderservice.order.model.entity.Order;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderMapper {
    private final ItemMapper itemMapper;

    public OrderDTO toDTO(Order order) {
        Set<OrderedItemDTO> items = order.getItems().stream()
                .map(itemMapper::toDTO)
                .collect(Collectors.toSet());

        return OrderDTO.builder()
                .orderNumber(order.getOrderNumber())
                .orderedItems(items)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .country(order.getCountry())
                .postalCode(order.getPostalCode())
                .city(order.getCity())
                .street(order.getStreet())
                .streetNumber(order.getStreetNumber())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public OrderSummaryDTO toSummaryDTO(Order order){
        return OrderSummaryDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .owner(order.getOwner())
                .createdAt(order.getCreatedAt())
                .itemCount(order.getItems().size())
                .build();
    }
}
