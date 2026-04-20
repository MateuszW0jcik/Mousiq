package org.example.mousiq.product.model.dto;

import lombok.*;
import org.example.mousiq.product.model.entity.Product;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummaryDTO {
    private UUID id;
    private String name;
    private String slug;
    private String brandName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private Boolean wireless;
    private Integer dpi;

    public ProductSummaryDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.slug = product.getSlug();
        this.brandName = product.getBrand() != null ? product.getBrand().getName() : null;
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.imageUrl = product.getImageUrl();
        this.wireless = product.getWireless();
        this.dpi = product.getDpi();
    }
}
