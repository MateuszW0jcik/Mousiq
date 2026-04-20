package org.example.mousiq.order.repository;

import org.example.mousiq.order.model.entity.Order;
import org.example.mousiq.user.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findOrdersByUser(User user, Pageable pageable);

    Page<Order> findByUserIn(List<User> users, Pageable pageable);

    Page<Order> findByOwnerContaining(String owner, Pageable pageable);
}
