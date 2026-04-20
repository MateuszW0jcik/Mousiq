package com.mousiq.common.dto.paymentMethod;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodDTO {
    private UUID id;
    private UUID userId;
    private String cardHolderName;
    private String cardLastFourDigits;
    private String cardBrand;
    private String expiryMonth;
    private String expiryYear;
    private boolean isDefault;
    private Instant createdAt;
}
