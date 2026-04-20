package org.example.mousiq.product.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.product.model.dto.ProductDTO;
import org.example.mousiq.product.model.dto.ProductSummaryDTO;
import org.example.mousiq.product.model.request.ProductRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.product.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Tag(name = "Products", description = "Endpoints for managing products")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @Operation(
            summary = "Get all products with filters and pagination",
            description = "Returns paginated list of products with optional filtering by name, brand, price range, etc."
    )
    @GetMapping
    public ResponseEntity<PageResponse<ProductSummaryDTO>> getProducts(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,

            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "12", required = false) int size,

            @Parameter(description = "Sort field")
            @RequestParam(value = "sortBy", defaultValue = "addedAt", required = false) String sortBy,

            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir,

            @Parameter(description = "Search by product name")
            @RequestParam(value = "name", required = false) String name,

            @Parameter(description = "Filter by brand names")
            @RequestParam(value = "brandNames", required = false) List<String> brandNames,

            @Parameter(description = "Filter by wireless (true/false)")
            @RequestParam(value = "wireless", required = false) Boolean wireless,

            @Parameter(description = "Minimum price")
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,

            @Parameter(description = "Maximum price")
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,

            @Parameter(description = "Filter by sensor type")
            @RequestParam(value = "sensorType", required = false) String sensorType,

            @Parameter(description = "Filter by connection type")
            @RequestParam(value = "connectionType", required = false) String connectionType,

            @Parameter(description = "Minimum DPI")
            @RequestParam(value = "minDpi", required = false) Integer minDpi,

            @Parameter(description = "Maximum DPI")
            @RequestParam(value = "maxDpi", required = false) Integer maxDpi
    ) {
        return ResponseEntity.ok(productService.getProducts(
                page, size, sortBy, sortDir, name, brandNames, wireless,
                minPrice, maxPrice, sensorType, connectionType, minDpi, maxDpi
        ));
    }

    @Operation(
            summary = "Get product by ID",
            description = "Returns detailed information about a specific product"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(
            @Parameter(description = "Product UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @Operation(
            summary = "Get product by slug",
            description = "Returns detailed information about a product using its URL-friendly slug"
    )
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDTO> getProductBySlug(
            @Parameter(description = "Product slug", example = "logitech-g502-hero")
            @PathVariable String slug
    ) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @Operation(
            summary = "Get new products",
            description = "Returns 8 most recently added products"
    )
    @GetMapping("/new")
    public ResponseEntity<List<ProductSummaryDTO>> getNewProducts() {
        return ResponseEntity.ok(productService.getNewProducts());
    }

    @Operation(
            summary = "Get best seller products",
            description = "Returns 8 best selling products"
    )
    @GetMapping("/best-sellers")
    public ResponseEntity<List<ProductSummaryDTO>> getBestSellersProducts() {
        return ResponseEntity.ok(productService.getBestSellersProducts());
    }

    @Operation(
            summary = "Add new product",
            description = "Creates a new product (Admin only). Image is uploaded to Cloudinary."
    )
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> addProduct(
            @Valid @RequestPart("request") ProductRequest request,
            @Parameter(description = "Product image file")
            @RequestPart("image") MultipartFile image
    ) {
        ProductDTO productDTO = productService.addProduct(request, image);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productDTO);
    }

    @Operation(
            summary = "Update product",
            description = "Updates an existing product (Admin only). Image upload is optional."
    )
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> editProduct(
            @Parameter(description = "Product UUID")
            @PathVariable UUID id,
            @Valid @RequestPart("request") ProductRequest request,
            @Parameter(description = "Product image file (optional)")
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        ProductDTO productDTO = productService.editProduct(id, request, image);
        return ResponseEntity.ok(productDTO);
    }

    @Operation(
            summary = "Delete product",
            description = "Deletes a product and its image from Cloudinary (Admin only)"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "Product UUID")
            @PathVariable UUID id
    ) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
