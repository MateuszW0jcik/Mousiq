package org.example.mousiq.seeder;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.address.repository.AddressRepository;
import org.example.mousiq.auth.repository.RefreshTokenRepository;
import org.example.mousiq.contact.repository.ContactRepository;
import org.example.mousiq.order.repository.OrderRepository;
import org.example.mousiq.paymentMethod.repository.PaymentMethodRepository;
import org.example.mousiq.user.repository.UserRepository;
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
    private final ProductSeeder productSeeder;

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ContactRepository contactRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OrderRepository orderRepository;

    @Override
    public void run(String... args){
        if(orderRepository.count()==0) {
            paymentMethodRepository.deleteAll();
            contactRepository.deleteAll();
            addressRepository.deleteAll();
            refreshTokenRepository.deleteAll();
            userRepository.deleteAll();

            userSeeder.seed();
            addressSeeder.seed();
            contactSeeder.seed();
            paymentMethodSeeder.seed();
            productSeeder.seed();
        }
    }
}



