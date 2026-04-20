package org.example.paymentservice.paymentMethod.service;

import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import com.mousiq.common.exception.BadRequestException;
import com.mousiq.common.exception.NotFoundException;
import org.example.paymentservice.paymentMethod.mapper.PaymentMethodMapper;
import org.example.paymentservice.paymentMethod.model.request.AddPaymentMethodRequest;
import org.example.paymentservice.paymentMethod.model.entity.PaymentMethod;
import org.example.paymentservice.paymentMethod.repository.PaymentMethodRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.paymentservice.payment.service.StripeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;
    private final StripeService stripeService;
    private final PaymentMethodMapper paymentMethodMapper;

    @Transactional(readOnly = true)
    public List<PaymentMethodDTO> getUserPaymentMethods(UUID userId) {
        return paymentMethodRepository.findByUserIdAndIsActiveTrue(userId).stream()
                .map(paymentMethodMapper::toDTO)
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

            return paymentMethodMapper.toDTO(paymentMethod);

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

    @Transactional
    public PaymentMethodDTO createTestPaymentMethodForUser(UUID userId) {
        PaymentMethod paymentMethod = PaymentMethod.builder()
                .userId(userId)
                .cardHolderName(String.valueOf(userId))
                .stripePaymentMethodId("pm_card_visa")
                .isActive(true)
                .cardLastFourDigits("4242")
                .cardBrand("visa")
                .expiryMonth("12")
                .expiryYear("2030")
                .createdAt(Instant.now())
                .build();

        paymentMethodRepository.save(paymentMethod);

        return paymentMethodMapper.toDTO(paymentMethod);
    }

    public PaymentMethod findPaymentMethodById(UUID id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment method with id: " + id + " does not exist"));
    }

    public PaymentMethodDTO getPaymentMethodById(UUID id) {
        return paymentMethodMapper.toDTO(findPaymentMethodById(id));
    }
}
