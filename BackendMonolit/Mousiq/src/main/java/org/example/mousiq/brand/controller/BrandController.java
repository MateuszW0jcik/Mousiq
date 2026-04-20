package org.example.mousiq.brand.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.brand.model.dto.BrandDTO;
import org.example.mousiq.brand.model.request.BrandRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.brand.service.BrandService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Brands", description = "Endpoints for managing brands")
@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService brandService;

    @Operation(
            summary = "Get brands with pagination",
            description = "Returns paginated list of brands with optional name filtering"
    )
    @GetMapping
    public ResponseEntity<PageResponse<BrandDTO>> getBrands(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field")
            @RequestParam(value = "sortBy", defaultValue = "name", required = false) String sortBy,
            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @Parameter(description = "Filter by brand name")
            @RequestParam(value = "name", required = false) String name
    ) {
        return ResponseEntity.ok(brandService.getBrands(page, size, sortBy, sortDir, name));
    }

    @Operation(
            summary = "Get all brands",
            description = "Returns all brands without pagination (for filters/dropdowns)"
    )
    @GetMapping("/all")
    public ResponseEntity<List<BrandDTO>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    @Operation(
            summary = "Add new brand",
            description = "Creates a new brand (Admin only)"
    )
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDTO> addBrand(@Valid @RequestBody BrandRequest request) {
        BrandDTO brand = brandService.addBrand(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(brand);
    }

    @Operation(
            summary = "Update brand",
            description = "Updates an existing brand (Admin only)"
    )
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDTO> editBrand(
            @Parameter(description = "Brand UUID")
            @PathVariable UUID id,
            @Valid @RequestBody BrandRequest request
    ) {
        BrandDTO brand = brandService.editBrand(id, request);
        return ResponseEntity.ok(brand);
    }

    @Operation(
            summary = "Delete brand",
            description = "Deletes a brand (Admin only)"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBrand(
            @Parameter(description = "Brand UUID")
            @PathVariable UUID id
    ) {
        brandService.deleteBrand(id);
        return ResponseEntity.noContent().build();
    }
}
