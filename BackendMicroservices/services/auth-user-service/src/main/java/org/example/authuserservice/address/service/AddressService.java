package org.example.authuserservice.address.service;

import com.mousiq.common.dto.address.AdminAddressDTO;
import com.mousiq.common.exception.ForbiddenException;
import com.mousiq.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.address.mapper.AddressMapper;
import org.example.authuserservice.address.model.dto.AddressDTO;
import org.example.authuserservice.address.model.entity.Address;
import org.example.authuserservice.address.model.request.AddressRequest;
import org.example.authuserservice.address.repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Transactional
    public AddressDTO addAddress(AddressRequest request, UUID userId) {
        Address address = Address.builder()
                .country(request.country())
                .postalCode(request.postalCode())
                .city(request.city())
                .street(request.street())
                .streetNumber(request.streetNumber())
                .userId(userId).build();

        return addressMapper.toDTO(saveAddress(address));
    }

    @Transactional
    public void deleteUserAddress(UUID id, UUID userId) {
        Address address = findAddressById(id);

        if (!address.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this address");
        }

        deleteAddress(address);
    }

    @Transactional
    public AddressDTO editUserAddress(UUID id, AddressRequest request, UUID userId) {
        Address address = findAddressById(id);

        if (!address.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this address");
        }

        address.setCountry(request.country());
        address.setPostalCode(request.postalCode());
        address.setCity(request.city());
        address.setStreet(request.street());
        address.setStreetNumber(request.streetNumber());

        return addressMapper.toDTO(saveAddress(address));
    }

    public List<AddressDTO> getUserAddresses(UUID userId) {
        return addressRepository.findAddressByUserId(userId)
                .stream()
                .map(addressMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Address findAddressById(UUID id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Address with id: " + id + " do not exist"));
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public void deleteAddress(Address address) {
        addressRepository.delete(address);
    }

    public AdminAddressDTO getAdminAddressById(UUID id) {
        return addressMapper.toAdminDTO(findAddressById(id));
    }
}
