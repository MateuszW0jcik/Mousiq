package org.example.mousiq.address.repository;

import org.example.mousiq.address.model.entity.Address;
import org.example.mousiq.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findAddressByUser(User user);
}
