package org.example.authuserservice.address.repository;

import org.example.authuserservice.address.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findAddressByUserId(UUID userId);
}
