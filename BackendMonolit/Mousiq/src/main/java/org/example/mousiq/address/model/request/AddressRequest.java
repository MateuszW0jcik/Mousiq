package org.example.mousiq.address.model.request;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        @NotBlank(message = "Country can't be empty")
        String country,
        @NotBlank(message = "Postal code can't be empty")
        String postalCode,
        @NotBlank(message = "City can't be empty")
        String city,
        @NotBlank(message = "Street can't be empty")
        String street,
        @NotBlank(message = "Street number can't be empty")
        String streetNumber
) {

}
