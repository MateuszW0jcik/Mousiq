package org.example.mousiq.address.service;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.address.model.dto.AddressDTO;
import org.example.mousiq.address.model.entity.Address;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.common.exception.ForbiddenException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.address.model.request.AddressRequest;
import org.example.mousiq.address.repository.AddressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;

    @Transactional
    public AddressDTO addAddress(AddressRequest request, User user) {
        Address address = Address.builder()
                .country(request.country())
                .postalCode(request.postalCode())
                .city(request.city())
                .street(request.street())
                .streetNumber(request.streetNumber())
                .user(user).build();

        return new AddressDTO(saveAddress(address));
    }

    public Address saveAddress(Address address){
        return addressRepository.save(address);
    }

    public Address findAddressById(UUID id){
        return addressRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Address with id: " + id + " do not exist"));
    }

    @Transactional
    public void deleteUserAddress(UUID id, User user) {
        Address address = findAddressById(id);

        if(!address.getUser().equals(user)){
            throw new ForbiddenException("User do not contains this address");
        }

        deleteAddress(address);
    }

    public void deleteAddress(Address address){
        addressRepository.delete(address);
    }

    @Transactional
    public AddressDTO editUserAddress(UUID id, AddressRequest request, User user) {
        Address address = findAddressById(id);

        if(!address.getUser().equals(user)){
            throw new ForbiddenException("User do not contains this address");
        }

        address.setCountry(request.country());
        address.setPostalCode(request.postalCode());
        address.setCity(request.city());
        address.setStreet(request.street());
        address.setStreetNumber(request.streetNumber());

        return new AddressDTO(saveAddress(address));
    }
    public List<AddressDTO> getUserAddresses(User user) {
        return addressRepository.findAddressByUser(user)
                .stream()
                .map(AddressDTO::new)
                .collect(Collectors.toList());
    }
}
