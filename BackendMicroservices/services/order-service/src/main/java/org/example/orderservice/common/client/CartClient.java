package org.example.orderservice.common.client;

import com.mousiq.common.dto.shoppingCart.ShoppingCartItemDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "CART-SERVICE")
public interface CartClient {

    @GetMapping("/internal/cart/user/{userId}")
    List<ShoppingCartItemDTO> getUserShoppingCart(@PathVariable("userId") UUID userId);

    @DeleteMapping("/internal/cart/user/{userId}")
    void clearCart(@PathVariable("userId") UUID userId);
}
