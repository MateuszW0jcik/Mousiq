package org.example.productservice.product.controller;

import com.mousiq.common.dto.product.ProductDTO;
import com.mousiq.common.response.MessageResponse;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.productservice.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/internal/products")
@RequiredArgsConstructor
public class InternalProductController {
    private final ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(
            @Parameter(description = "Product UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> existsProductById(
            @Parameter(description = "Product UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(productService.existsProductById(id));
    }

    @PutMapping(value = "/{id}/increase-stock")
    public ResponseEntity<MessageResponse> increaseQuantityOfProduct(
            @Parameter(description = "Product UUID")
            @PathVariable UUID id,
            @Valid @RequestParam("quantity") Long quantity
    ) {
        productService.increaseQuantityOfProduct(id, quantity);
        return ResponseEntity.ok(new MessageResponse("Product quantity updated"));
    }

    @PutMapping(value = "/{id}/decrease-stock")
    public ResponseEntity<MessageResponse> decreaseQuantityOfProduct(
            @Parameter(description = "Product UUID")
            @PathVariable UUID id,
            @Valid @RequestParam("quantity") Long quantity
    ) {
        productService.decreaseQuantityOfProduct(id, quantity);
        return ResponseEntity.ok(new MessageResponse("Product quantity updated"));
    }
}
