package org.example.cartservice.cart.mapper;

import com.mousiq.common.dto.product.ProductDTO;
import com.mousiq.common.dto.product.ProductSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    public ProductSummaryDTO toSummaryDTO(ProductDTO product) {
        if (product == null) {
            return null;
        }

        return ProductSummaryDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .brandName(product.getBrand().getName())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .wireless(product.getWireless())
                .dpi(product.getDpi()).build();
    }
}
