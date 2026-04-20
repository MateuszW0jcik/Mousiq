package org.example.orderservice.common.listener;

import com.mousiq.common.event.payment.PaymentCompletedEvent;
import com.mousiq.common.event.payment.PaymentFailedEvent;
import com.mousiq.common.event.payment.PaymentRefundedEvent;
import org.example.orderservice.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final OrderService orderService;

    @KafkaListener(
            topics = "payment-completed",
            groupId = "order-service",
            containerFactory = "paymentCompletedKafkaListenerContainerFactory"
    )
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        orderService.handlePaymentCompleted(event);
    }

    @KafkaListener(
            topics = "payment-failed",
            groupId = "order-service",
            containerFactory = "paymentFailedKafkaListenerContainerFactory"
    )
    public void handlePaymentFailed(PaymentFailedEvent event) {
        orderService.handlePaymentFailed(event);
    }

    @KafkaListener(
            topics = "payment-refunded",
            groupId = "order-service",
            containerFactory = "paymentRefundedKafkaListenerContainerFactory"
    )
    public void handlePaymentRefunded(PaymentRefundedEvent event) {
        orderService.handlePaymentRefunded(event);
    }
}
