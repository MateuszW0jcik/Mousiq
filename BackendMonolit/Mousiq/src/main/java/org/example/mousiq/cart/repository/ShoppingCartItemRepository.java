package org.example.mousiq.cart.repository;

import org.example.mousiq.product.model.entity.Product;
import org.example.mousiq.cart.model.entity.ShoppingCartItem;
import org.example.mousiq.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, UUID> {
    boolean existsShoppingCartItemByProductAndUser(Product product, User user);

    Optional<ShoppingCartItem> findShoppingCartItemByProductAndUser(Product product, User user);

    List<ShoppingCartItem> findShoppingCartItemsByUserOrderByIdAsc(User user);
}
