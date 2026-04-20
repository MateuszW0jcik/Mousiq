package org.example.productservice.product.mapper;

import com.mousiq.common.dto.product.ProductDTO;
import com.mousiq.common.dto.product.ProductSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.example.productservice.brand.mapper.BrandMapper;
import org.example.productservice.product.model.entity.Product;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final BrandMapper brandMapper;

    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .brand(brandMapper.toDTO(product.getBrand()))
                .description(product.getDescription())
                .dpi(product.getDpi())
                .sensorType(product.getSensorType())
                .wireless(product.getWireless())
                .connectionType(product.getConnectionType())
                .numberOfButtons(product.getNumberOfButtons())
                .rgbLighting(product.getRgbLighting())
                .weight(product.getWeight())
                .color(product.getColor())
                .programmableButtons(product.getProgrammableButtons())
                .pollingRate(product.getPollingRate())
                .gripType(product.getGripType())
                .batteryLife(product.getBatteryLife())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .addedAt(product.getAddedAt())
                .imageUrl(product.getImageUrl())
                .imagePublicId(product.getImagePublicId()).build();
    }

    public ProductSummaryDTO toSummaryDTO(Product product) {
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
