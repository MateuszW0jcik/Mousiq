package org.example.orderservice.common.client;

import com.mousiq.common.dto.product.ProductDTO;
import com.mousiq.common.dto.shippingMethod.ShippingMethodDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {

    @GetMapping("/internal/products/{id}")
    ProductDTO getProductById(@PathVariable("id") UUID id);

    @GetMapping("/internal/shipping-methods/{id}")
    ShippingMethodDTO getShippingMethodById(@PathVariable("id") UUID id);

    @PutMapping("/internal/products/{id}/decrease-stock")
    void decreaseStock(@PathVariable("id") UUID productId, @RequestParam("quantity") Long quantity);

    @PutMapping("/internal/products/{id}/increase-stock")
    void increaseStock(@PathVariable("id") UUID productId, @RequestParam("quantity") Long quantity);
}
