package org.example.authuserservice.common.seeder;

import lombok.RequiredArgsConstructor;
import org.example.authuserservice.address.repository.AddressRepository;
import org.example.authuserservice.auth.repository.RefreshTokenRepository;
import org.example.authuserservice.contact.repository.ContactRepository;
import org.example.authuserservice.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
@RequiredArgsConstructor
@Order(1)
public class PerformanceTestDataSeeder implements CommandLineRunner {
    private final UserSeeder userSeeder;
    private final AddressSeeder addressSeeder;
    private final ContactSeeder contactSeeder;
    private final PaymentMethodSeeder paymentMethodSeeder;

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ContactRepository contactRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void run(String... args) {
        contactRepository.deleteAll();
        addressRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();

        userSeeder.seed();
        addressSeeder.seed();
        contactSeeder.seed();
        paymentMethodSeeder.seed();
    }
}
