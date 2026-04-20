package org.example.paymentservice.paymentMethod.controller;

import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.example.paymentservice.paymentMethod.service.PaymentMethodService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/internal/payment-methods")
@RequiredArgsConstructor
public class InternalPaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodDTO> getPaymentMethodById(
            @Parameter(description = "Payment method UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethodById(id));
    }
}
