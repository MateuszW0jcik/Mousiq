package org.example.orderservice.order.repository;

import org.example.orderservice.order.model.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findOrdersByUserId(UUID userId, Pageable pageable);

    Page<Order> findByOwnerContaining(String owner, Pageable pageable);
}
