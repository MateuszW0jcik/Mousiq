package org.example.authuserservice.address.mapper;

import com.mousiq.common.dto.address.AdminAddressDTO;
import org.example.authuserservice.address.model.dto.AddressDTO;
import org.example.authuserservice.address.model.entity.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public AddressDTO toDTO(Address address) {
        if (address == null) {
            return null;
        }

        return AddressDTO.builder()
                .id(address.getId())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .city(address.getCity())
                .street(address.getStreet())
                .streetNumber(address.getStreetNumber()).build();
    }

    public AdminAddressDTO toAdminDTO(Address address){
        if (address == null) {
            return null;
        }

        return AdminAddressDTO.builder()
                .id(address.getId())
                .userId(address.getUserId())
                .id(address.getId())
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .city(address.getCity())
                .street(address.getStreet())
                .streetNumber(address.getStreetNumber()).build();
    }
}
