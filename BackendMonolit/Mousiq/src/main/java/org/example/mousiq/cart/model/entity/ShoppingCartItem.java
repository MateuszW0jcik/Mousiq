package org.example.mousiq.cart.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.mousiq.product.model.entity.Product;
import org.example.mousiq.user.model.entity.User;

import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "shopping_cart_items")
public class ShoppingCartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Long quantity;
}
