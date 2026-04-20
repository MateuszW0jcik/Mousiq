package org.example.cartservice.cart.controller;

import com.mousiq.common.dto.shoppingCart.ShoppingCartItemDTO;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.example.cartservice.cart.service.ShoppingCartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/internal/cart")
@RequiredArgsConstructor
public class InternalShoppingCartItemController {
    private final ShoppingCartItemService shoppingCartItemService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShoppingCartItemDTO>> getShoppingCartByUserId(
            @Parameter(description = "User UUID")
            @PathVariable UUID userId
    ) {
        return ResponseEntity.ok(shoppingCartItemService.getUserShoppingCartItemsDTO(userId));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUserShoppingCart(
            @Parameter(description = "User UUID")
            @PathVariable UUID userId
    ) {
        shoppingCartItemService.clearUserShoppingCart(userId);
        return ResponseEntity.noContent().build();
    }
}
