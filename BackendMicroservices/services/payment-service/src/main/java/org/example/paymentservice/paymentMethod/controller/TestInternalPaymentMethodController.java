package org.example.paymentservice.paymentMethod.controller;

import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.example.paymentservice.paymentMethod.service.PaymentMethodService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/internal/payment-methods")
@RequiredArgsConstructor
@Profile("test")
public class TestInternalPaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @PostMapping("/test-create/{userId}")
    public ResponseEntity<PaymentMethodDTO> createTestPaymentMethodForUser(
            @Parameter(description = "User UUID")
            @PathVariable UUID userId
    ) {
        return ResponseEntity.ok(paymentMethodService.createTestPaymentMethodForUser(userId));
    }
}
