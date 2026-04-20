package org.example.authuserservice.common.client;

import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.UUID;

@FeignClient(name = "PAYMENT-SERVICE")
@Profile("test")
public interface PaymentMethodClient {

    @PostMapping("/internal/payment-methods/test-create/{userId}")
    PaymentMethodDTO createTestPaymentMethodForUser(@PathVariable("userId") UUID userId);
}
