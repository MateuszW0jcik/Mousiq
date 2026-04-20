package org.example.cartservice.cart.repository;

import org.example.cartservice.cart.model.entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, UUID> {
    boolean existsShoppingCartItemByProductIdAndUserId(UUID productId, UUID userId);

    Optional<ShoppingCartItem> findShoppingCartItemByProductIdAndUserId(UUID productId, UUID userId);

    List<ShoppingCartItem> findShoppingCartItemsByUserIdOrderByIdAsc(UUID userId);
}
