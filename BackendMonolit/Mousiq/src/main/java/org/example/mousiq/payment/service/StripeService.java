package org.example.mousiq.payment.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.Webhook;
import com.stripe.param.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class StripeService {

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    public PaymentMethod attachPaymentMethodToCustomer(String paymentMethodId, String customerId) throws StripeException {
        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);

        PaymentMethodAttachParams params = PaymentMethodAttachParams.builder()
                .setCustomer(customerId)
                .build();

        return paymentMethod.attach(params);
    }

    public Customer createOrGetCustomer(UUID userId, String email) throws StripeException {
        CustomerSearchParams searchParams = CustomerSearchParams.builder()
                .setQuery("metadata['user_id']:'" + userId.toString() + "'")
                .build();

        CustomerSearchResult result = Customer.search(searchParams);

        if (!result.getData().isEmpty()) {
            return result.getData().getFirst();
        }

        Map<String, String> metadata = new HashMap<>();
        metadata.put("user_id", userId.toString());

        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(email)
                .putAllMetadata(metadata)
                .build();

        return Customer.create(params);
    }

    public PaymentIntent createPaymentIntentWithSavedCard(
            UUID paymentId,
            BigDecimal amount,
            String customerId,
            String paymentMethodId
    ) throws StripeException {

        long amountInCents = amount.multiply(new BigDecimal("100")).longValue();

        Map<String, String> metadata = new HashMap<>();
        metadata.put("payment_id", paymentId.toString());

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setCustomer(customerId)
                .setPaymentMethod(paymentMethodId)
                .setConfirm(true)
                .setOffSession(true)
                .putAllMetadata(metadata)
                .build();

        return PaymentIntent.create(params);
    }

    public PaymentIntent createPaymentIntent(
            UUID paymentId,
            BigDecimal amount,
            String customerId
    ) throws StripeException {

        long amountInCents = amount.multiply(new BigDecimal("100")).longValue();

        Map<String, String> metadata = new HashMap<>();
        metadata.put("payment_id", paymentId.toString());

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setCustomer(customerId)
                .putAllMetadata(metadata)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }

    public PaymentMethod getPaymentMethod(String paymentMethodId) throws StripeException {
        return PaymentMethod.retrieve(paymentMethodId);
    }

    public void detachPaymentMethod(String paymentMethodId) throws StripeException {
        PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
        paymentMethod.detach();
    }

    public Event verifyWebhook(String payload, String signature) throws StripeException {
        return Webhook.constructEvent(payload, signature, webhookSecret);
    }

    public void refundPayment(String paymentIntentId, BigDecimal amount) throws StripeException {
        long amountInCents = amount.multiply(new BigDecimal("100")).longValue();

        RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(paymentIntentId)
                .setAmount(amountInCents)
                .build();

        Refund.create(params);
    }
}
