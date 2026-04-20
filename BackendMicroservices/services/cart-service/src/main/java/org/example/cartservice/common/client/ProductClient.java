package org.example.cartservice.common.client;

import com.mousiq.common.dto.product.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {

    @GetMapping("/internal/products/{id}")
    ProductDTO getProductById(@PathVariable("id") UUID id);

    @GetMapping("/internal/products/{id}/exists")
    Boolean exitsProductById(@PathVariable("id") UUID id);
}
