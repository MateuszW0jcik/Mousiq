package org.example.mousiq.shippingMethod.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.shippingMethod.model.dto.ShippingMethodDTO;
import org.example.mousiq.shippingMethod.model.request.ShippingMethodRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.shippingMethod.service.ShippingMethodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Shipping Methods", description = "Endpoints for managing shipping/delivery methods")
@RestController
@RequestMapping("/api/shipping-methods")
@RequiredArgsConstructor
public class ShippingMethodController {
    private final ShippingMethodService shippingMethodService;

    @Operation(
            summary = "Get all shipping methods",
            description = "Returns all available shipping methods without pagination (for checkout)"
    )
    @GetMapping("/all")
    public ResponseEntity<List<ShippingMethodDTO>> getAllShippingMethods() {
        return ResponseEntity.ok(shippingMethodService.getAllShippingMethods());
    }

    @Operation(
            summary = "Get shipping methods with pagination",
            description = "Returns paginated list of shipping methods with optional name filtering (Admin panel)"
    )
    @GetMapping
    public ResponseEntity<PageResponse<ShippingMethodDTO>> getShippingMethods(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field")
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy,
            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @Parameter(description = "Filter by shipping method name")
            @RequestParam(value = "name", required = false) String name
    ) {
        return ResponseEntity.ok(shippingMethodService.getShippingMethods(page, size, sortBy, sortDir, name));
    }

    @Operation(
            summary = "Add shipping method",
            description = "Creates a new shipping method (Admin only)"
    )
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShippingMethodDTO> addShippingMethod(
            @Valid @RequestBody ShippingMethodRequest request
    ) {
        ShippingMethodDTO shippingMethodDTO = shippingMethodService.addShippingMethod(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(shippingMethodDTO);
    }

    @Operation(
            summary = "Update shipping method",
            description = "Updates an existing shipping method (Admin only)"
    )
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ShippingMethodDTO> editShippingMethod(
            @Parameter(description = "Shipping method UUID")
            @PathVariable UUID id,
            @Valid @RequestBody ShippingMethodRequest request
    ) {
        ShippingMethodDTO shippingMethodDTO = shippingMethodService.editShippingMethod(id, request);
        return ResponseEntity.ok(shippingMethodDTO);
    }

    @Operation(
            summary = "Delete shipping method",
            description = "Deletes a shipping method (Admin only)"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShippingMethod(
            @Parameter(description = "Shipping method UUID")
            @PathVariable UUID id
    ) {
        shippingMethodService.deleteShippingMethod(id);
        return ResponseEntity.noContent().build();
    }
}
