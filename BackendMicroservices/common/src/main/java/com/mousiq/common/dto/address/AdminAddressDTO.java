package com.mousiq.common.dto.address;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAddressDTO {
    private UUID id;
    private UUID userId;
    private String country;
    private String postalCode;
    private String city;
    private String street;
    private String streetNumber;
}
