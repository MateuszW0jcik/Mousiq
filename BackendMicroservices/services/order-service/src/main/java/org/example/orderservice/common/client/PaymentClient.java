package org.example.orderservice.common.client;

import com.mousiq.common.dto.payment.PaymentDTO;
import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import org.example.orderservice.order.model.request.CreatePaymentRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "PAYMENT-SERVICE")
public interface PaymentClient {

    @PostMapping("/internal/payments")
    PaymentDTO createPayment(@RequestBody CreatePaymentRequest request);

    @GetMapping("/internal/payment-methods/{id}")
    PaymentMethodDTO getPaymentMethodById(@PathVariable("id") UUID id);
}
