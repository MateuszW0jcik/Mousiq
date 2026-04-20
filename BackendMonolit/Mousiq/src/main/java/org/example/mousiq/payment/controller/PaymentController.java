package org.example.mousiq.payment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.payment.model.request.RefundRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.payment.model.dto.PaymentDTO;
import org.example.mousiq.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Payments", description = "Manage order payments")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(
            summary = "Get payment details",
            description = "Get details of a specific payment"
    )
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @Operation(
            summary = "Stripe webhook",
            description = "Handle Stripe payment events"
    )
    @PostMapping("/webhook/stripe")
    public ResponseEntity<Void> stripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature
    ) {
        paymentService.handleStripeWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Refund payment",
            description = "Issue a full or partial refund (Admin only)"
    )
    @PostMapping("/{id}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> refundPayment(
            @PathVariable UUID id,
            @Valid @RequestBody RefundRequest request
    ) {
        paymentService.refundPayment(id, request);
        return ResponseEntity.ok(new MessageResponse("Refund processed successfully"));
    }
}
