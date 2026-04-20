package org.example.mousiq.seeder;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.payment.service.StripeService;
import org.example.mousiq.paymentMethod.model.entity.PaymentMethod;
import org.example.mousiq.paymentMethod.repository.PaymentMethodRepository;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.user.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@Profile("test")
@RequiredArgsConstructor
public class PaymentMethodSeeder {
    private final UserRepository userRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public void seed() {
        List<User> users = userRepository.findAll();

        for (User user : users) {
            PaymentMethod paymentMethod = PaymentMethod.builder()
                    .userId(user.getId())
                    .cardHolderName(user.getFirstName())
                    .stripePaymentMethodId("pm_card_visa")
                    .isActive(true)
                    .cardLastFourDigits("4242")
                    .cardBrand("visa")
                    .expiryMonth("12")
                    .expiryYear("2030")
                    .createdAt(Instant.now())
                    .build();

            paymentMethodRepository.save(paymentMethod);
        }
    }
}
