package org.example.productservice.shippingMethod.controller;

import com.mousiq.common.dto.shippingMethod.ShippingMethodDTO;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.example.productservice.shippingMethod.service.ShippingMethodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/internal/shipping-methods")
@RequiredArgsConstructor
public class InternalShippingMethodController {
    private final ShippingMethodService shippingMethodService;

    @GetMapping("/{id}")
    public ResponseEntity<ShippingMethodDTO> getShippingMethodById(
            @Parameter(description = "Shipping method UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(shippingMethodService.getShippingMethodById(id));
    }
}
