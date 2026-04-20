package org.example.mousiq.brand.repository;

import org.example.mousiq.brand.model.entity.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BrandRepository extends JpaRepository<Brand, UUID> {
    Optional<Brand> findBrandByName(String name);

    List<Brand> findBrandsByNameIn(List<String> names);

    Page<Brand> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsBrandByName(String name);

    Optional<Brand> findBrandById(UUID id);
}
