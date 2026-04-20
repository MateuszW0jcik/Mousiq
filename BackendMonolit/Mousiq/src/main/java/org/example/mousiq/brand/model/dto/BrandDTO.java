package org.example.mousiq.brand.model.dto;

import lombok.*;
import org.example.mousiq.brand.model.entity.Brand;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrandDTO {
    private UUID id;
    private String name;

    public BrandDTO(Brand brand) {
        this.id = brand.getId();
        this.name = brand.getName();
    }
}
