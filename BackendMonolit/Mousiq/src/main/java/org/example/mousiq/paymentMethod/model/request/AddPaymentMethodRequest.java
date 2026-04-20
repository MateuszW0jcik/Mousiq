package org.example.mousiq.paymentMethod.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddPaymentMethodRequest {

    @NotNull(message = "Stripe payment method ID is required")
    private String stripePaymentMethodId;

    @NotBlank(message = "Card holder name is required")
    private String cardHolderName;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    private String userEmail;

    private Boolean isDefault;
}
