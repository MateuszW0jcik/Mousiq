package org.example.mousiq.order.service;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.order.model.entity.Order;
import org.example.mousiq.order.model.entity.OrderedItem;
import org.example.mousiq.order.repository.OrderedItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderedItemService {
    private final OrderedItemRepository orderedItemRepository;

    public void saveOrderedItem(OrderedItem orderedItem) {
        orderedItemRepository.save(orderedItem);
    }

    public List<OrderedItem> findOrderedItemsByOrder(Order order) {
        return orderedItemRepository.findOrderedItemsByOrder(order);
    }
}
