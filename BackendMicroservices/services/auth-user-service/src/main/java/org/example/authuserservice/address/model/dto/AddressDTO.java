package org.example.authuserservice.address.model.dto;

import lombok.*;
import org.example.authuserservice.address.model.entity.Address;

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
}
