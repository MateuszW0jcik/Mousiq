package org.example.mousiq.order.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.mousiq.address.model.entity.Address;
import org.example.mousiq.address.service.AddressService;
import org.example.mousiq.cart.model.entity.ShoppingCartItem;
import org.example.mousiq.cart.service.ShoppingCartItemService;
import org.example.mousiq.common.exception.BadRequestException;
import org.example.mousiq.common.exception.ForbiddenException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.contact.model.entity.Contact;
import org.example.mousiq.contact.service.ContactService;
import org.example.mousiq.payment.model.request.CreatePaymentRequest;
import org.example.mousiq.order.model.request.OrderRequest;
import org.example.mousiq.order.model.request.UpdateOrderStatusRequest;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.order.model.dto.OrderDTO;
import org.example.mousiq.order.model.dto.OrderSummaryDTO;
import org.example.mousiq.order.model.dto.OrderedItemDTO;
import org.example.mousiq.order.model.entity.Order;
import org.example.mousiq.order.model.entity.OrderStatus;
import org.example.mousiq.order.model.entity.OrderedItem;
import org.example.mousiq.order.repository.OrderRepository;
import org.example.mousiq.payment.model.dto.PaymentDTO;
import org.example.mousiq.paymentMethod.model.entity.PaymentMethod;
import org.example.mousiq.paymentMethod.service.PaymentMethodService;
import org.example.mousiq.payment.service.PaymentService;
import org.example.mousiq.product.model.entity.Product;
import org.example.mousiq.product.service.ProductService;
import org.example.mousiq.shippingMethod.model.entity.ShippingMethod;
import org.example.mousiq.shippingMethod.service.ShippingMethodService;
import org.example.mousiq.user.model.entity.User;
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
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final ContactService contactService;
    private final AddressService addressService;
    private final PaymentService paymentService;
    private final PaymentMethodService paymentMethodService;
    private final ShoppingCartItemService shoppingCartItemService;
    private final ShippingMethodService shippingMethodService;
    private final ProductService productService;

    @Transactional
    public PageResponse<OrderSummaryDTO> getUserOrders(User user, int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Order> orders = orderRepository.findOrdersByUser(user, pageable);

        List<OrderSummaryDTO> content = orders.getContent()
                .stream()
                .map(OrderSummaryDTO::new)
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
                .map(OrderSummaryDTO::new)
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

        return new OrderDTO(order);
    }

    @Transactional
    public OrderDTO getUserOrderDetails(UUID orderId, User user) {
        Order order = getOrderById(orderId);

        if (!order.getUser().equals(user)) {
            throw new ForbiddenException("User do not contains this order");
        }

        return new OrderDTO(order);
    }

    @Transactional
    public OrderSummaryDTO createOrder(OrderRequest request, User user) {
        Contact contact = contactService.findContactById(request.contactId());
        if (!contact.getUser().equals(user)) {
            throw new ForbiddenException("User do not contains this contact");
        }

        Address address = addressService.findAddressById(request.addressId());
        if (!address.getUser().equals(user)) {
            throw new ForbiddenException("User do not contains this address");
        }

        PaymentMethod paymentMethod = paymentMethodService.findPaymentMethodById(request.paymentMethodId());
        if (!paymentMethod.getUserId().equals(user.getId())) {
            throw new ForbiddenException("User do not contains this payment");
        }

        List<ShoppingCartItem> shoppingCartItems = shoppingCartItemService.getUserShoppingCartItems(user);
        if (shoppingCartItems.isEmpty()) {
            throw new ForbiddenException("User do not have shopping cart");
        }

        List<OrderedItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (ShoppingCartItem cartItem : shoppingCartItems) {
            Product product = cartItem.getProduct();

            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Product " + product.getName() + " is out of stock. Available: "
                        + product.getQuantity() + ", Requested: " + cartItem.getQuantity());
            }

            totalPrice = totalPrice.add(BigDecimal.valueOf(cartItem.getQuantity()).multiply(product.getPrice()));

            orderItems.add(OrderedItem.builder()
                    .productName(product.getName())
                    .productId(product.getId())
                    .brandName(product.getBrand() != null ? product.getBrand().getName() : "Unknown")
                    .price(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .productImageUrl(product.getImageUrl())
                    .build());
        }

        ShippingMethod shippingMethod = shippingMethodService.findShippingMethodById(request.shippingMethodId());

        totalPrice = totalPrice.add(shippingMethod.getPrice());

        Order order = Order.builder()
                .user(user)
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

        for (OrderedItem item : orderItems) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        order = saveOrder(order);


        CreatePaymentRequest paymentRequest = CreatePaymentRequest.builder()
                .orderId(order.getId())
                .userId(user.getId())
                .amount(totalPrice)
                .paymentMethodId(request.paymentMethodId())
                .userEmail(user.getEmail())
                .build();

        PaymentDTO payment = paymentService.createPayment(paymentRequest);

        order.setOrderNumber(generateOrderNumber(order));
        order.setPaymentId(payment.getId());
        saveOrder(order);

        for (OrderedItem item : orderItems) {
            productService.decreaseStock(item.getProductId(), item.getQuantity());
        }

        shoppingCartItemService.clearUserShoppingCart(user);

        return new OrderSummaryDTO(order);
    }

    @Transactional
    public OrderSummaryDTO updateOrderStatus(UUID orderId, UpdateOrderStatusRequest request) {
        Order order = getOrderById(orderId);

        validateStatusTransition(order.getStatus(), request.status());

        order.setStatus(request.status());

        return new OrderSummaryDTO(orderRepository.save(order));
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

    private OrderSummaryDTO mapToSummaryDTO(Order order) {
        return OrderSummaryDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .owner(order.getOwner())
                .createdAt(order.getCreatedAt())
                .itemCount(order.getItems().size())
                .build();
    }

    private OrderDTO mapToDTO(Order order) {
        Set<OrderedItemDTO> items = order.getItems().stream()
                .map(OrderedItemDTO::new)
                .collect(Collectors.toSet());

        return OrderDTO.builder()
                .orderNumber(order.getOrderNumber())
                .orderedItems(items)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .country(order.getCountry())
                .postalCode(order.getPostalCode())
                .city(order.getCity())
                .street(order.getStreet())
                .streetNumber(order.getStreetNumber())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
