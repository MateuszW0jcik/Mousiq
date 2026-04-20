package org.example.paymentservice.paymentMethod.controller;

import com.mousiq.common.annotation.CurrentUserId;
import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import com.mousiq.common.response.MessageResponse;
import org.example.paymentservice.paymentMethod.model.request.AddPaymentMethodRequest;
import org.example.paymentservice.paymentMethod.service.PaymentMethodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Payment Methods", description = "Manage user's saved payment methods")
@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @Operation(
            summary = "Get user's payment methods",
            description = "Returns all saved payment methods for the authenticated user"
    )
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PaymentMethodDTO>> getUserPaymentMethods(
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity.ok(paymentMethodService.getUserPaymentMethods(userId));
    }

    @Operation(
            summary = "Add payment method",
            description = "Add a new payment method for the user"
    )
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentMethodDTO> addPaymentMethod(
            @Valid @RequestBody AddPaymentMethodRequest request,
            @CurrentUserId UUID userId
    ) {
        PaymentMethodDTO paymentMethod = paymentMethodService.addPaymentMethod(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMethod);
    }

    @Operation(
            summary = "Set default payment method",
            description = "Set a payment method as the default for future orders"
    )
    @PutMapping("/{id}/default")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> setDefaultPaymentMethod(
            @PathVariable UUID id,
            @CurrentUserId UUID userId
    ) {
        paymentMethodService.setDefaultPaymentMethod(id, userId);
        return ResponseEntity.ok(new MessageResponse("Default payment method updated"));
    }

    @Operation(
            summary = "Delete payment method",
            description = "Remove a saved payment method"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> deletePaymentMethod(
            @PathVariable UUID id,
            @CurrentUserId UUID userId
    ) {
        paymentMethodService.deletePaymentMethod(id, userId);
        return ResponseEntity.ok(new MessageResponse("Payment method deleted"));
    }
}
