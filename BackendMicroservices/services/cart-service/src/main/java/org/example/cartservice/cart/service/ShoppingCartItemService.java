package org.example.cartservice.cart.service;

import com.mousiq.common.dto.product.ProductDTO;
import com.mousiq.common.dto.shoppingCart.ShoppingCartItemDTO;
import com.mousiq.common.exception.ForbiddenException;
import com.mousiq.common.exception.NotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.cartservice.cart.repository.ShoppingCartItemRepository;
import org.example.cartservice.common.client.ProductClient;
import org.example.cartservice.cart.mapper.ProductMapper;
import org.example.cartservice.cart.model.entity.ShoppingCartItem;
import org.example.cartservice.cart.model.request.ShoppingCartItemRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingCartItemService {
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ProductClient productClient;
    private final ProductMapper productMapper;

    @Transactional
    public List<ShoppingCartItemDTO> getUserShoppingCartItemsDTO(UUID userId) {
        return shoppingCartItemRepository.findShoppingCartItemsByUserIdOrderByIdAsc(userId)
                .stream()
                .map(cartItem -> {
                    ProductDTO productDTO = productClient.getProductById(cartItem.getProductId());

                    return ShoppingCartItemDTO.builder()
                            .id(cartItem.getId())
                            .product(productMapper.toSummaryDTO(productDTO))
                            .quantity(cartItem.getQuantity())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ShoppingCartItemDTO addUserShoppingCartItem(ShoppingCartItemRequest request, UUID userId) {
        if (existsShoppingCartItemByProductIdAndUserId(request.productId(), userId)) {
            ShoppingCartItem shoppingCartItem = findShoppingCartItemByProductIdAndUserId(request.productId(), userId);
            shoppingCartItem.setQuantity(shoppingCartItem.getQuantity() + request.quantity());
            ShoppingCartItem cartItem = saveShoppingCartItem(shoppingCartItem);
            ProductDTO productDTO = productClient.getProductById(cartItem.getProductId());
            return ShoppingCartItemDTO.builder()
                    .id(cartItem.getId())
                    .product(productMapper.toSummaryDTO(productDTO))
                    .quantity(cartItem.getQuantity())
                    .build();
        } else {
            if (!productClient.exitsProductById(request.productId())) {
                throw new NotFoundException("Product with id: " + request.productId() + " do not exists");
            }

            ShoppingCartItem shoppingCartItem = ShoppingCartItem.builder()
                    .userId(userId)
                    .productId(request.productId())
                    .quantity(request.quantity())
                    .build();

            ShoppingCartItem cartItem = saveShoppingCartItem(shoppingCartItem);
            ProductDTO productDTO = productClient.getProductById(cartItem.getProductId());
            return ShoppingCartItemDTO.builder()
                    .id(cartItem.getId())
                    .product(productMapper.toSummaryDTO(productDTO))
                    .quantity(cartItem.getQuantity())
                    .build();
        }
    }

    @Transactional
    public ShoppingCartItemDTO updateUserShoppingCartItem(UUID id, Long newQuantity, UUID userId) {
        ShoppingCartItem shoppingCartItem = findShoppingCartItemById(id);

        if (!shoppingCartItem.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this shopping cart item");
        }

        shoppingCartItem.setQuantity(newQuantity);

        ShoppingCartItem cartItem = saveShoppingCartItem(shoppingCartItem);
        ProductDTO productDTO = productClient.getProductById(cartItem.getProductId());
        return ShoppingCartItemDTO.builder()
                .id(cartItem.getId())
                .product(productMapper.toSummaryDTO(productDTO))
                .quantity(cartItem.getQuantity())
                .build();
    }

    @Transactional
    public void deleteUserShoppingCartItem(UUID id, UUID userId) {
        ShoppingCartItem shoppingCartItem = findShoppingCartItemById(id);

        if (!shoppingCartItem.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this shopping cart item");
        }

        deleteShoppingCartItem(shoppingCartItem);
    }

    public List<ShoppingCartItem> getUserShoppingCartItems(UUID userId) {
        return shoppingCartItemRepository.findShoppingCartItemsByUserIdOrderByIdAsc(userId);
    }

    private void deleteShoppingCartItem(ShoppingCartItem shoppingCartItem) {
        shoppingCartItemRepository.delete(shoppingCartItem);
    }

    private ShoppingCartItem findShoppingCartItemById(UUID id) {
        return shoppingCartItemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Shopping cart item with id: " + id + " do not exist"));
    }

    public boolean existsShoppingCartItemByProductIdAndUserId(UUID productId, UUID userId) {
        return shoppingCartItemRepository.existsShoppingCartItemByProductIdAndUserId(productId, userId);
    }

    public ShoppingCartItem findShoppingCartItemByProductIdAndUserId(UUID productId, UUID userId) {
        return shoppingCartItemRepository.findShoppingCartItemByProductIdAndUserId(productId, userId)
                .orElseThrow(() -> new NotFoundException(
                        "Shopping cart item with product: " + productId + " for user do not exist"));
    }

    public ShoppingCartItem saveShoppingCartItem(ShoppingCartItem shoppingCartItem) {
        return shoppingCartItemRepository.save(shoppingCartItem);
    }

    @Transactional
    public void clearUserShoppingCart(UUID userId) {
        List<ShoppingCartItem> shoppingCartItems = getUserShoppingCartItems(userId);
        for (ShoppingCartItem shoppingCartItem : shoppingCartItems) {
            deleteShoppingCartItem(shoppingCartItem);
        }
    }
}
