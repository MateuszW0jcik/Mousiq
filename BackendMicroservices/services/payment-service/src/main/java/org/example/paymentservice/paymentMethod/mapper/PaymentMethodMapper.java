package org.example.paymentservice.paymentMethod.mapper;

import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import lombok.RequiredArgsConstructor;
import org.example.paymentservice.paymentMethod.model.entity.PaymentMethod;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentMethodMapper {
    public PaymentMethodDTO toDTO(PaymentMethod paymentMethod){
        if (paymentMethod == null){
            return null;
        }

        return PaymentMethodDTO.builder()
                .id(paymentMethod.getId())
                .userId(paymentMethod.getUserId())
                .cardHolderName(paymentMethod.getCardHolderName())
                .cardLastFourDigits(paymentMethod.getCardLastFourDigits())
                .cardBrand(paymentMethod.getCardBrand())
                .expiryMonth(paymentMethod.getExpiryMonth())
                .expiryYear(paymentMethod.getExpiryYear())
                .isDefault(paymentMethod.getIsDefault())
                .createdAt(paymentMethod.getCreatedAt())
                .build();
    }
}
