package org.example.productservice.shippingMethod.mapper;

import com.mousiq.common.dto.shippingMethod.ShippingMethodDTO;
import org.example.productservice.shippingMethod.model.entity.ShippingMethod;
import org.springframework.stereotype.Component;

@Component
public class ShippingMethodMapper {
    public ShippingMethodDTO toDTO(ShippingMethod shippingMethod) {
        if (shippingMethod == null) {
            return null;
        }

        return ShippingMethodDTO.builder()
                .id(shippingMethod.getId())
                .name(shippingMethod.getName())
                .description(shippingMethod.getDescription())
                .price(shippingMethod.getPrice()).build();
    }
}
