package org.example.mousiq.seeder;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.product.model.entity.Product;
import org.example.mousiq.product.repository.ProductRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("test")
@RequiredArgsConstructor
public class ProductSeeder {
    private final ProductRepository productRepository;

    public void seed(){
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            product.setQuantity(10000);

            productRepository.save(product);
        }
    }
}