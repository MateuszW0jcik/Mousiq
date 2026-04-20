package org.example.orderservice.order.service;

import com.mousiq.common.dto.address.AdminAddressDTO;
import com.mousiq.common.dto.contact.AdminContactDTO;
import com.mousiq.common.dto.order.OrderDTO;
import com.mousiq.common.dto.order.OrderSummaryDTO;
import com.mousiq.common.dto.payment.PaymentDTO;
import com.mousiq.common.dto.paymentMethod.PaymentMethodDTO;
import com.mousiq.common.dto.product.ProductDTO;
import com.mousiq.common.dto.shippingMethod.ShippingMethodDTO;
import com.mousiq.common.dto.shoppingCart.ShoppingCartItemDTO;
import com.mousiq.common.dto.user.UserDTO;
import com.mousiq.common.enums.order.OrderStatus;
import com.mousiq.common.event.payment.PaymentCompletedEvent;
import com.mousiq.common.event.payment.PaymentFailedEvent;
import com.mousiq.common.event.payment.PaymentRefundedEvent;
import com.mousiq.common.exception.BadRequestException;
import com.mousiq.common.exception.ForbiddenException;
import com.mousiq.common.exception.NotFoundException;
import com.mousiq.common.response.PageResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.orderservice.common.client.AuthUserClient;
import org.example.orderservice.common.client.CartClient;
import org.example.orderservice.common.client.PaymentClient;
import org.example.orderservice.common.client.ProductClient;
import org.example.orderservice.order.mapper.OrderMapper;
import org.example.orderservice.order.model.request.CreatePaymentRequest;
import org.example.orderservice.order.model.request.OrderRequest;
import org.example.orderservice.order.model.request.UpdateOrderStatusRequest;
import org.example.orderservice.order.model.entity.Order;
import org.example.orderservice.order.model.entity.OrderItem;
import org.example.orderservice.order.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartClient cartClient;
    private final ProductClient productClient;
    private final PaymentClient paymentClient;
    private final AuthUserClient authUserClient;
    private final OrderMapper orderMapper;

    @Transactional
    public PageResponse<OrderSummaryDTO> getUserOrders(UUID userId, int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Order> orders = orderRepository.findOrdersByUserId(userId, pageable);

        List<OrderSummaryDTO> content = orders.getContent()
                .stream()
                .map(orderMapper::toSummaryDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages(),
                orders.isLast());
    }

    @Transactional
    public PageResponse<OrderSummaryDTO> getAllOrders(int pageNo, int pageSize, String sortBy, String sortDir, String ownerName) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Order> orders = orderRepository.findByOwnerContaining(ownerName, pageable);

        List<OrderSummaryDTO> content = orders.getContent()
                .stream()
                .map(orderMapper::toSummaryDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages(),
                orders.isLast());
    }

    @Transactional
    public OrderDTO getOrderDetails(UUID orderId) {
        Order order = getOrderById(orderId);

        return orderMapper.toDTO(order);
    }

    @Transactional
    public OrderDTO getUserOrderDetails(UUID orderId, UUID userId) {
        Order order = getOrderById(orderId);

        if (!order.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this order");
        }

        return orderMapper.toDTO(order);
    }

    @Transactional
    public OrderSummaryDTO createOrder(OrderRequest request, UUID userId) {
        UserDTO user = authUserClient.getUserById(userId);

        AdminContactDTO contact = authUserClient.getContactById(request.contactId());
        if (!contact.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this contact");
        }

        AdminAddressDTO address = authUserClient.getAddressById(request.addressId());
        if (!address.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this address");
        }

        PaymentMethodDTO paymentMethod = paymentClient.getPaymentMethodById(request.paymentMethodId());
        if (!paymentMethod.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this payment method");
        }

        List<ShoppingCartItemDTO> shoppingCartItems = cartClient.getUserShoppingCart(userId);
        if (shoppingCartItems.isEmpty()) {
            throw new ForbiddenException("User do not have shopping cart");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (ShoppingCartItemDTO cartItem : shoppingCartItems) {
            ProductDTO product = productClient.getProductById(cartItem.getProduct().getId());

            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Product " + product.getName() + " is out of stock. Available: "
                        + product.getQuantity() + ", Requested: " + cartItem.getQuantity());
            }

            totalPrice = totalPrice.add(BigDecimal.valueOf(cartItem.getQuantity()).multiply(product.getPrice()));

            orderItems.add(OrderItem.builder()
                    .productName(product.getName())
                    .productId(product.getId())
                    .brandName(product.getBrand() != null ? product.getBrand().getName() : "Unknown")
                    .price(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .productImageUrl(product.getImageUrl())
                    .build());
        }

        ShippingMethodDTO shippingMethod = productClient.getShippingMethodById(request.shippingMethodId());

        totalPrice = totalPrice.add(shippingMethod.getPrice());

        Order order = Order.builder()
                .userId(userId)
                .totalPrice(totalPrice)
                .country(address.getCountry())
                .postalCode(address.getPostalCode())
                .city(address.getCity())
                .street(address.getStreet())
                .streetNumber(address.getStreetNumber())
                .email(contact.getEmail())
                .phoneNumber(contact.getPhoneNumber())
                .owner(user.getFirstName() + " " + user.getLastName() + " (" + user.getEmail() + ")")
                .status(OrderStatus.PENDING).build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        order = saveOrder(order);

        CreatePaymentRequest paymentRequest = CreatePaymentRequest.builder()
                .orderId(order.getId())
                .userId(userId)
                .amount(totalPrice)
                .paymentMethodId(request.paymentMethodId())
                .userEmail(user.getEmail())
                .build();

        PaymentDTO payment = paymentClient.createPayment(paymentRequest);

        order.setOrderNumber(generateOrderNumber(order));
        order.setPaymentId(payment.getId());
        saveOrder(order);

        for (OrderItem item : orderItems) {
            productClient.decreaseStock(item.getProductId(), item.getQuantity());
        }

        cartClient.clearCart(userId);

        return orderMapper.toSummaryDTO(order);
    }

    @Transactional
    public void updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
        Order order = getOrderById(orderId);

        validateStatusTransition(order.getStatus(), request.status());

        order.setStatus(request.status());
        orderRepository.save(order);
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

        for (OrderItem item : order.getItems()) {
            productClient.increaseStock(item.getProductId(), item.getQuantity());
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
            for (OrderItem item : order.getItems()) {
                try {
                    productClient.increaseStock(item.getProductId(), item.getQuantity());
                } catch (Exception e) {
                    log.error("Failed to increase stock for product {}: {}", item.getProductId(), e.getMessage());
                }
            }
        }
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order getOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order with id: " + id + " do not exist"));
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of cancelled order");
        }

        if (currentStatus == OrderStatus.DELIVERED && newStatus != OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of delivered order");
        }

        if (newStatus != OrderStatus.CANCELLED) {
            if (currentStatus == OrderStatus.SHIPPED && newStatus == OrderStatus.PROCESSING) {
                throw new BadRequestException("Cannot move shipped order back to processing");
            }
            if (currentStatus == OrderStatus.SHIPPED && newStatus == OrderStatus.PENDING) {
                throw new BadRequestException("Cannot move shipped order back to pending");
            }
            if (currentStatus == OrderStatus.PROCESSING && newStatus == OrderStatus.PENDING) {
                throw new BadRequestException("Cannot move processing order back to pending");
            }
        }
    }

    private String generateOrderNumber(Order order) {
        LocalDate date = order.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate();
        String dateStr = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String shortId = order.getId().toString().substring(0, 8).toUpperCase();
        return "ORD-" + dateStr + "-" + shortId;
    }
}
