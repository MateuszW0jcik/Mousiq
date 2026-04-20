package org.example.productservice.common.seeder;

import lombok.RequiredArgsConstructor;
import org.example.productservice.product.model.entity.Product;
import org.example.productservice.product.repository.ProductRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
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
