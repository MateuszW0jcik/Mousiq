package org.example.mousiq.payment.service;

import com.stripe.exception.StripeException;
import com.stripe.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.mousiq.order.model.entity.Order;
import org.example.mousiq.order.model.entity.OrderStatus;
import org.example.mousiq.order.model.entity.OrderedItem;
import org.example.mousiq.payment.model.dto.PaymentCompletedEvent;
import org.example.mousiq.payment.model.dto.PaymentDTO;
import org.example.mousiq.payment.model.dto.PaymentFailedEvent;
import org.example.mousiq.payment.model.dto.PaymentRefundedEvent;
import org.example.mousiq.payment.model.entity.Payment;
import org.example.mousiq.paymentMethod.model.entity.PaymentMethod;
import org.example.mousiq.common.exception.BadRequestException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.payment.model.request.CreatePaymentRequest;
import org.example.mousiq.payment.model.request.RefundRequest;
import org.example.mousiq.order.repository.OrderRepository;
import org.example.mousiq.payment.model.entity.PaymentStatus;
import org.example.mousiq.paymentMethod.repository.PaymentMethodRepository;
import org.example.mousiq.payment.repository.PaymentRepository;
import org.example.mousiq.product.service.ProductService;
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
    private final OrderRepository orderRepository;
    private final ProductService productService;

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
            } else {
                paymentIntent = stripeService.createPaymentIntent(
                        payment.getId(),
                        request.getAmount(),
                        customer.getId()
                );
            }

            payment.setStripePaymentIntentId(paymentIntent.getId());
            payment.setStripeClientSecret(paymentIntent.getClientSecret());

            payment = paymentRepository.save(payment);

            return mapToDTO(payment);

        } catch (StripeException e) {
            log.error("Stripe error while creating payment: {}", e.getMessage());
            throw new BadRequestException("Failed to create payment: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found"));
        return mapToDTO(payment);
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

        log.info("Payment {} completed for order: {}", payment.getId(), payment.getOrderId());

        handlePaymentCompleted(PaymentCompletedEvent.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .build());
    }

    private void handlePaymentFailed(Event event) {
        PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();

        String paymentId = paymentIntent.getMetadata().get("payment_id");

        Payment payment = paymentRepository.findById(UUID.fromString(paymentId))
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(paymentIntent.getLastPaymentError().getMessage());
        paymentRepository.save(payment);

        log.warn("Payment {} failed for order: {}", payment.getId(), payment.getOrderId());

        handlePaymentFailed(PaymentFailedEvent.builder()
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

            log.info("Refund processed for payment: {}", id);

            handlePaymentRefunded(PaymentRefundedEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .amount(request.getAmount())
                    .build());

        } catch (StripeException e) {
            log.error("Stripe error while refunding: {}", e.getMessage());
            throw new BadRequestException("Failed to process refund: " + e.getMessage());
        }
    }

    private PaymentDTO mapToDTO(Payment payment) {
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

    @Transactional
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new NotFoundException("Order not found"));

        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);
    }

    @Transactional
    public void handlePaymentFailed(PaymentFailedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new NotFoundException("Order not found"));

        order.setStatus(OrderStatus.PAYMENT_FAILED);
        orderRepository.save(order);

        for (OrderedItem item : order.getItems()) {
            productService.increaseStock(item.getProductId(), item.getQuantity());
        }
    }

    @Transactional
    public void handlePaymentRefunded(PaymentRefundedEvent event) {
        Order order = orderRepository.findById(event.getOrderId())
                .orElseThrow(() -> new NotFoundException("Order not found"));

        boolean isFullRefund = event.getAmount().compareTo(order.getTotalPrice()) == 0;

        if (isFullRefund) {
            order.setStatus(OrderStatus.REFUNDED);
        } else {
            order.setStatus(OrderStatus.PARTIALLY_REFUNDED);
        }

        orderRepository.save(order);

        if (isFullRefund) {
            for (OrderedItem item : order.getItems()) {
                productService.increaseStock(item.getProductId(), item.getQuantity());
            }
        }
    }
}