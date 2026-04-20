package org.example.authuserservice.common.seeder;

import lombok.RequiredArgsConstructor;
import org.example.authuserservice.common.client.PaymentMethodClient;
import org.example.authuserservice.user.model.entity.User;
import org.example.authuserservice.user.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("test")
@RequiredArgsConstructor
public class PaymentMethodSeeder {
    private final PaymentMethodClient paymentMethodClient;

    private final UserRepository userRepository;

    public void seed() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            paymentMethodClient.createTestPaymentMethodForUser(user.getId());
        }
    }
}
