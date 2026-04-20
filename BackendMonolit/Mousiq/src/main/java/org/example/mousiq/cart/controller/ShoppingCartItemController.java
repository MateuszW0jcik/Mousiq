package org.example.mousiq.cart.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.cart.model.dto.ShoppingCartItemDTO;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.cart.model.request.ShoppingCartItemRequest;
import org.example.mousiq.cart.model.request.UpdateQuantityRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.cart.service.ShoppingCartItemService;
import org.example.mousiq.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Shopping Cart", description = "Endpoints for managing user shopping cart")
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class ShoppingCartItemController {
    private final ShoppingCartItemService shoppingCartItemService;
    private final UserService userService;

    @Operation(
            summary = "Get shopping cart",
            description = "Returns all items in the authenticated user's shopping cart"
    )
    @GetMapping
    public ResponseEntity<List<ShoppingCartItemDTO>> getUserShoppingCartItems(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(shoppingCartItemService.getUserShoppingCartItemsDTO(user));
    }

    @Operation(
            summary = "Add item to cart",
            description = "Adds a product to the authenticated user's shopping cart"
    )
    @PostMapping
    public ResponseEntity<ShoppingCartItemDTO> addUserShoppingCartItem(
            @Valid @RequestBody ShoppingCartItemRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        ShoppingCartItemDTO shoppingCartItem = shoppingCartItemService.addUserShoppingCartItem(request, user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(shoppingCartItem);
    }

    @Operation(
            summary = "Update cart item quantity",
            description = "Updates the quantity of an item in the shopping cart"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ShoppingCartItemDTO> updateUserShoppingCartItem(
            @Parameter(description = "Cart item UUID")
            @PathVariable UUID id,
            @Valid @RequestBody UpdateQuantityRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        ShoppingCartItemDTO shoppingCartItem = shoppingCartItemService.updateUserShoppingCartItem(id, request.quantity(), user);
        return ResponseEntity.ok(shoppingCartItem);
    }

    @Operation(
            summary = "Remove item from cart",
            description = "Removes an item from the authenticated user's shopping cart"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserShoppingCartItem(
            @Parameter(description = "Cart item UUID")
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        shoppingCartItemService.deleteUserShoppingCartItem(id, user);
        return ResponseEntity.noContent().build();
    }
}
