package org.example.mousiq.shippingMethod.repository;

import org.example.mousiq.shippingMethod.model.entity.ShippingMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ShippingMethodRepository extends JpaRepository<ShippingMethod, UUID> {
    Optional<ShippingMethod> findShippingMethodById(UUID id);

    Page<ShippingMethod> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
