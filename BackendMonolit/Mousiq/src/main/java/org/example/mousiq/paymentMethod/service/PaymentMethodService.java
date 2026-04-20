package org.example.mousiq.paymentMethod.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.mousiq.paymentMethod.model.dto.PaymentMethodDTO;
import org.example.mousiq.paymentMethod.model.entity.PaymentMethod;
import org.example.mousiq.common.exception.BadRequestException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.paymentMethod.model.request.AddPaymentMethodRequest;
import org.example.mousiq.paymentMethod.repository.PaymentMethodRepository;
import org.example.mousiq.payment.service.StripeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final StripeService stripeService;

    @Transactional(readOnly = true)
    public List<PaymentMethodDTO> getUserPaymentMethods(UUID userId) {
        return paymentMethodRepository.findByUserIdAndIsActiveTrue(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentMethodDTO addPaymentMethod(AddPaymentMethodRequest request, UUID userId) {
        try {
            Customer customer = stripeService.createOrGetCustomer(userId, request.getUserEmail());

            com.stripe.model.PaymentMethod stripePaymentMethod = stripeService.attachPaymentMethodToCustomer(
                    request.getStripePaymentMethodId(),
                    customer.getId()
            );

            com.stripe.model.PaymentMethod.Card card = stripePaymentMethod.getCard();

            PaymentMethod paymentMethod = PaymentMethod.builder()
                    .userId(userId)
                    .stripePaymentMethodId(stripePaymentMethod.getId())
                    .cardHolderName(request.getCardHolderName())
                    .cardLastFourDigits(card.getLast4())
                    .cardBrand(card.getBrand())
                    .expiryMonth(String.format("%02d", card.getExpMonth()))
                    .expiryYear(card.getExpYear().toString())
                    .isDefault(request.getIsDefault())
                    .isActive(true)
                    .build();

            if (request.getIsDefault()) {
                paymentMethodRepository.findByUserIdAndIsActiveTrue(userId)
                        .forEach(pm -> pm.setIsDefault(false));
            }

            paymentMethod = paymentMethodRepository.save(paymentMethod);

            return mapToDTO(paymentMethod);

        } catch (StripeException e) {
            throw new BadRequestException("Failed to add payment method: " + e.getMessage());
        }
    }

    @Transactional
    public void setDefaultPaymentMethod(UUID id, UUID userId) {
        PaymentMethod paymentMethod = paymentMethodRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Payment method not found"));

        paymentMethodRepository.findByUserIdAndIsActiveTrue(userId)
                .forEach(pm -> pm.setIsDefault(false));

        paymentMethod.setIsDefault(true);
        paymentMethodRepository.save(paymentMethod);
    }

    @Transactional
    public void deletePaymentMethod(UUID id, UUID userId) {
        PaymentMethod paymentMethod = paymentMethodRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Payment method not found"));

        try {
            stripeService.detachPaymentMethod(paymentMethod.getStripePaymentMethodId());

            paymentMethod.setIsActive(false);
            paymentMethodRepository.save(paymentMethod);
        } catch (StripeException e) {
            log.error("Stripe error while deleting payment method: {}", e.getMessage());
            throw new BadRequestException("Failed to delete payment method: " + e.getMessage());
        }
    }

    public PaymentMethod findPaymentMethodById(UUID id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment method with id: " + id + " does not exist"));
    }

    private PaymentMethodDTO mapToDTO(PaymentMethod paymentMethod) {
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

    public PaymentMethodDTO getPaymentMethodById(UUID id) {
        return mapToDTO(findPaymentMethodById(id));
    }
}
