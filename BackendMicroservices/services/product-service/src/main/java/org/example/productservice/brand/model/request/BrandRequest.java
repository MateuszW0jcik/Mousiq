package org.example.productservice.brand.model.request;

import jakarta.validation.constraints.NotBlank;

        public record BrandRequest(
        @NotBlank(message = "Name can't be empty")
        String name
) {
}
