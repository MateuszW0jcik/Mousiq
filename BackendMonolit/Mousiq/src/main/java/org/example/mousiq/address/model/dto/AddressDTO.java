package org.example.mousiq.address.model.dto;

import lombok.*;
import org.example.mousiq.address.model.entity.Address;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private UUID id;
    private String country;
    private String postalCode;
    private String city;
    private String street;
    private String streetNumber;

    public AddressDTO(Address address) {
        this.id = address.getId();
        this.country = address.getCountry();
        this.postalCode = address.getPostalCode();
        this.city = address.getCity();
        this.street = address.getStreet();
        this.streetNumber = address.getStreetNumber();
    }
}
