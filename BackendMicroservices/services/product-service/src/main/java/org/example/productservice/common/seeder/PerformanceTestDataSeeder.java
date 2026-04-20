package org.example.productservice.common.seeder;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
@RequiredArgsConstructor
@Order(1)
public class PerformanceTestDataSeeder implements CommandLineRunner {
    private final ProductSeeder productSeeder;

    @Override
    public void run(String... args) {
        productSeeder.seed();
    }
}
