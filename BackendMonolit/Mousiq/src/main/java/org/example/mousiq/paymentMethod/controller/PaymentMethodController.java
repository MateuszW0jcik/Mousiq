package org.example.mousiq.paymentMethod.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.paymentMethod.model.request.AddPaymentMethodRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.paymentMethod.model.dto.PaymentMethodDTO;
import org.example.mousiq.paymentMethod.service.PaymentMethodService;
import org.example.mousiq.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Payment Methods", description = "Manage user's saved payment methods")
@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;
    private final UserService userService;

    @Operation(
            summary = "Get user's payment methods",
            description = "Returns all saved payment methods for the authenticated user"
    )
    @GetMapping
    public ResponseEntity<List<PaymentMethodDTO>> getUserPaymentMethods(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(paymentMethodService.getUserPaymentMethods(user.getId()));
    }

    @Operation(
            summary = "Add payment method",
            description = "Add a new payment method for the user"
    )
    @PostMapping
    public ResponseEntity<PaymentMethodDTO> addPaymentMethod(
            @Valid @RequestBody AddPaymentMethodRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        PaymentMethodDTO paymentMethod = paymentMethodService.addPaymentMethod(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMethod);
    }

    @Operation(
            summary = "Set default payment method",
            description = "Set a payment method as the default for future orders"
    )
    @PutMapping("/{id}/default")
    public ResponseEntity<MessageResponse> setDefaultPaymentMethod(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        paymentMethodService.setDefaultPaymentMethod(id, user.getId());
        return ResponseEntity.ok(new MessageResponse("Default payment method updated"));
    }

    @Operation(
            summary = "Delete payment method",
            description = "Remove a saved payment method"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deletePaymentMethod(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        paymentMethodService.deletePaymentMethod(id, user.getId());
        return ResponseEntity.ok(new MessageResponse("Payment method deleted"));
    }
}
