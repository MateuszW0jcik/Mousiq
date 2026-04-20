package org.example.paymentservice.payment.mapper;

import com.mousiq.common.dto.payment.PaymentDTO;
import lombok.RequiredArgsConstructor;
import org.example.paymentservice.payment.model.entity.Payment;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PaymentMapper {
    public PaymentDTO toDTO(Payment payment){
        if(payment == null){
            return null;
        }

        return PaymentDTO.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .stripeClientSecret(payment.getStripeClientSecret())
                .failureReason(payment.getFailureReason())
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
