package org.example.mousiq.order.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.order.model.dto.OrderDTO;
import org.example.mousiq.order.model.dto.OrderSummaryDTO;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.order.model.request.OrderRequest;
import org.example.mousiq.order.model.request.UpdateOrderStatusRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.order.service.OrderService;
import org.example.mousiq.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Orders", description = "Endpoints for managing customer orders")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    @Operation(
            summary = "Get user orders",
            description = "Returns paginated list of orders for the authenticated user"
    )
    @GetMapping
    public ResponseEntity<PageResponse<OrderSummaryDTO>> getUserOrders(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field")
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getUserOrders(user, page, size, sortBy, sortDir));
    }

    @Operation(
            summary = "Get all orders",
            description = "Returns paginated list of all orders with optional filtering (Admin only)"
    )
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<OrderSummaryDTO>> getAllOrders(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field")
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,
            @Parameter(description = "Filter by customer name")
            @RequestParam(value = "ownerName", required = false) String ownerName
    ) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size, sortBy, sortDir, ownerName));
    }

    @Operation(
            summary = "Get order details (Admin)",
            description = "Returns detailed information about any order (Admin only)"
    )
    @GetMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> getOrderDetailsAdmin(
            @Parameter(description = "Order UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(orderService.getOrderDetails(id));
    }

    @Operation(
            summary = "Get order details",
            description = "Returns detailed information about user's own order"
    )
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getUserOrderDetails(
            @Parameter(description = "Order UUID")
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getUserOrderDetails(id, user));
    }

    @Operation(
            summary = "Create order",
            description = "Creates a new order from user's shopping cart"
    )
    @PostMapping
    public ResponseEntity<OrderSummaryDTO> createOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        OrderSummaryDTO orderSummaryDTO = orderService.createOrder(request, user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(orderSummaryDTO);
    }

    @Operation(
            summary = "Update order status",
            description = "Updates the status of an order (Admin only)"
    )
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderSummaryDTO> updateOrderStatus(
            @Parameter(description = "Order UUID")
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderSummaryDTO orderSummaryDTO = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(orderSummaryDTO);
    }
}
