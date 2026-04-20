package org.example.mousiq.product.repository;

import org.example.mousiq.product.model.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Product> findTop8ByOrderByAddedAtDesc();

    List<Product> findTop8ByOrderByAddedAtAsc();
}
