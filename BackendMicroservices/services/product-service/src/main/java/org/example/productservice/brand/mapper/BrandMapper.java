package org.example.productservice.brand.mapper;

import com.mousiq.common.dto.product.BrandDTO;
import org.example.productservice.brand.model.entity.Brand;
import org.springframework.stereotype.Component;

@Component
public class BrandMapper {
    public BrandDTO toDTO(Brand brand) {
        if (brand == null) {
            return null;
        }

        return BrandDTO.builder()
                .id(brand.getId())
                .name(brand.getName()).build();
    }
}
