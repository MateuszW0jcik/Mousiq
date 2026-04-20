package org.example.mousiq.order.repository;

import org.example.mousiq.order.model.entity.Order;
import org.example.mousiq.order.model.entity.OrderedItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderedItemRepository extends JpaRepository<OrderedItem, UUID> {
    List<OrderedItem> findOrderedItemsByOrder(Order order);
}
