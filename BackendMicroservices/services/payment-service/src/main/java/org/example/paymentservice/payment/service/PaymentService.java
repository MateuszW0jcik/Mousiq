package org.example.paymentservice.payment.service;

import com.mousiq.common.dto.payment.PaymentDTO;
import com.mousiq.common.enums.payment.PaymentStatus;
import com.mousiq.common.event.payment.PaymentCompletedEvent;
import com.mousiq.common.event.payment.PaymentFailedEvent;
import com.mousiq.common.event.payment.PaymentRefundedEvent;
import com.mousiq.common.exception.BadRequestException;
import com.mousiq.common.exception.NotFoundException;
import org.example.paymentservice.payment.mapper.PaymentMapper;
import org.example.paymentservice.payment.model.request.CreatePaymentRequest;
import org.example.paymentservice.payment.model.request.RefundRequest;
import org.example.paymentservice.payment.model.entity.Payment;
import org.example.paymentservice.paymentMethod.model.entity.PaymentMethod;
import org.example.paymentservice.paymentMethod.repository.PaymentMethodRepository;
import org.example.paymentservice.payment.repository.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final StripeService stripeService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final PaymentMapper paymentMapper;

    @Transactional
    public PaymentDTO createPayment(CreatePaymentRequest request) {
        try {
            Payment payment = Payment.builder()
                    .orderId(request.getOrderId())
                    .userId(request.getUserId())
                    .amount(request.getAmount())
                    .status(PaymentStatus.PENDING)
                    .build();

            Customer customer = stripeService.createOrGetCustomer(
                    request.getUserId(),
                    request.getUserEmail()
            );

            PaymentIntent paymentIntent;

            payment = paymentRepository.save(payment);

            if (request.getPaymentMethodId() != null) {
                PaymentMethod savedMethod = paymentMethodRepository
                        .findByIdAndUserId(request.getPaymentMethodId(), request.getUserId())
                        .orElseThrow(() -> new NotFoundException("Payment method not found"));

                payment.setPaymentMethodId(savedMethod.getId());

                paymentIntent = stripeService.createPaymentIntentWithSavedCard(
                        payment.getId(),
                        request.getAmount(),
                        customer.getId(),
                        savedMethod.getStripePaymentMethodId()
                );
            }
            else {
                paymentIntent = stripeService.createPaymentIntent(
                        payment.getId(),
                        request.getAmount(),
                        customer.getId()
                );
            }

            payment.setStripePaymentIntentId(paymentIntent.getId());
            payment.setStripeClientSecret(paymentIntent.getClientSecret());

            payment = paymentRepository.save(payment);

            return paymentMapper.toDTO(payment);
        } catch (StripeException e) {
            log.error("Stripe error while creating payment: {}", e.getMessage());
            throw new BadRequestException("Failed to create payment: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found"));
        return paymentMapper.toDTO(payment);
    }

    @Transactional
    public void handleStripeWebhook(String payload, String signature) {
        try {
            Event event = stripeService.verifyWebhook(payload, signature);

            switch (event.getType()) {
                case "payment_intent.succeeded":
                    handlePaymentSuccess(event);
                    break;
                case "payment_intent.payment_failed":
                    handlePaymentFailed(event);
                    break;
                default:
                    log.info("Unhandled event type: {}", event.getType());
            }
        } catch (StripeException e) {
            log.error("Stripe webhook verification failed: {}", e.getMessage());
            throw new BadRequestException("Invalid webhook signature");
        }
    }

    private void handlePaymentSuccess(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();

        String paymentId = paymentIntent.getMetadata().get("payment_id");

        Payment payment = paymentRepository.findById(UUID.fromString(paymentId))
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(Instant.now());
        paymentRepository.save(payment);

        try {
            kafkaTemplate.send("payment-completed", PaymentCompletedEvent.builder()
                            .paymentId(payment.getId())
                            .orderId(payment.getOrderId())
                            .amount(payment.getAmount())
                            .build())
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Kafka event sent successfully to topic: payment-completed, partition: {}, offset: {}",
                                    result.getRecordMetadata().partition(),
                                    result.getRecordMetadata().offset());
                        } else {
                            log.error("Failed to send Kafka event", ex);
                        }
                    });
        } catch (Exception e) {
            log.error("Exception while sending Kafka event", e);
        }
    }

    private void handlePaymentFailed(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();

        String paymentId = paymentIntent.getMetadata().get("payment_id");

        Payment payment = paymentRepository.findById(UUID.fromString(paymentId))
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(paymentIntent.getLastPaymentError().getMessage());
        paymentRepository.save(payment);

        kafkaTemplate.send("payment-failed", PaymentFailedEvent.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .reason(payment.getFailureReason())
                .build());
    }

    @Transactional
    public void refundPayment(UUID id, RefundRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new BadRequestException("Can only refund completed payments");
        }

        try {
            stripeService.refundPayment(payment.getStripePaymentIntentId(), request.getAmount());

            if (request.getAmount().compareTo(payment.getAmount()) == 0) {
                payment.setStatus(PaymentStatus.REFUNDED);
            } else {
                payment.setStatus(PaymentStatus.PARTIALLY_REFUNDED);
            }

            paymentRepository.save(payment);

            kafkaTemplate.send("payment-refunded", PaymentRefundedEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .amount(request.getAmount())
                    .build());

        } catch (StripeException e) {
            log.error("Stripe error while refunding: {}", e.getMessage());
            throw new BadRequestException("Failed to process refund: " + e.getMessage());
        }
    }
}