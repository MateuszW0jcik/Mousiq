package org.example.mousiq.cart.model.dto;

import lombok.*;
import org.example.mousiq.product.model.dto.ProductSummaryDTO;
import org.example.mousiq.cart.model.entity.ShoppingCartItem;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingCartItemDTO {
    private UUID id;
    private ProductSummaryDTO product;
    private Long quantity;

    public ShoppingCartItemDTO(ShoppingCartItem cartItem) {
        this.id = cartItem.getId();
        this.product = cartItem.getProduct() != null
                ? new ProductSummaryDTO(cartItem.getProduct())
                : null;
        this.quantity = cartItem.getQuantity();
    }
}
