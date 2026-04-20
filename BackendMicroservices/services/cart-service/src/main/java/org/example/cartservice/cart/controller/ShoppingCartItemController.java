package org.example.cartservice.cart.controller;

import com.mousiq.common.annotation.CurrentUserId;
import com.mousiq.common.dto.shoppingCart.ShoppingCartItemDTO;
import com.mousiq.common.response.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.cartservice.cart.model.request.ShoppingCartItemRequest;
import org.example.cartservice.cart.model.request.UpdateQuantityRequest;
import org.example.cartservice.cart.service.ShoppingCartItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Shopping Cart", description = "Endpoints for managing user shopping cart")
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class ShoppingCartItemController {
    private final ShoppingCartItemService shoppingCartItemService;

    @Operation(
            summary = "Get shopping cart",
            description = "Returns all items in the authenticated user's shopping cart"
    )
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ShoppingCartItemDTO>> getUserShoppingCartItems(
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity.ok(shoppingCartItemService.getUserShoppingCartItemsDTO(userId));
    }

    @Operation(
            summary = "Add item to cart",
            description = "Adds a product to the authenticated user's shopping cart"
    )
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShoppingCartItemDTO> addUserShoppingCartItem(
            @Valid @RequestBody ShoppingCartItemRequest request,
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(shoppingCartItemService.addUserShoppingCartItem(request, userId));
    }

    @Operation(
            summary = "Update cart item quantity",
            description = "Updates the quantity of an item in the shopping cart"
    )
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ShoppingCartItemDTO> updateUserShoppingCartItem(
            @Parameter(description = "Cart item UUID")
            @PathVariable UUID id,
            @Valid @RequestBody UpdateQuantityRequest request,
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity.ok(shoppingCartItemService.updateUserShoppingCartItem(id, request.quantity(), userId));
    }

    @Operation(
            summary = "Remove item from cart",
            description = "Removes an item from the authenticated user's shopping cart"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUserShoppingCartItem(
            @Parameter(description = "Cart item UUID")
            @PathVariable UUID id,
            @CurrentUserId UUID userId
    ) {
        shoppingCartItemService.deleteUserShoppingCartItem(id, userId);
        return ResponseEntity.noContent().build();
    }
}
