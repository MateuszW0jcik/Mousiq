package org.example.mousiq.cart.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.cart.model.dto.ShoppingCartItemDTO;
import org.example.mousiq.product.model.entity.Product;
import org.example.mousiq.cart.model.entity.ShoppingCartItem;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.common.exception.ForbiddenException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.cart.model.request.ShoppingCartItemRequest;
import org.example.mousiq.cart.repository.ShoppingCartItemRepository;
import org.example.mousiq.product.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoppingCartItemService {
    private final ShoppingCartItemRepository shoppingCartItemRepository;
    private final ProductService productService;

    @Transactional
    public List<ShoppingCartItemDTO> getUserShoppingCartItemsDTO(User user) {
        return shoppingCartItemRepository.findShoppingCartItemsByUserOrderByIdAsc(user)
                .stream()
                .map(ShoppingCartItemDTO::new)
                .collect(Collectors.toList());
    }

    public List<ShoppingCartItem> getUserShoppingCartItems(User user) {
        return shoppingCartItemRepository.findShoppingCartItemsByUserOrderByIdAsc(user);
    }

    @Transactional
    public ShoppingCartItemDTO addUserShoppingCartItem(ShoppingCartItemRequest request, User user) {
        Product product = productService.findProductById(request.productId());
        if (existsShoppingCartItemByProductAndUser(product, user)) {
            ShoppingCartItem shoppingCartItem = findShoppingCartItemByProductAndUser(product, user);
            shoppingCartItem.setQuantity(shoppingCartItem.getQuantity() + request.quantity());
            return new ShoppingCartItemDTO(saveShoppingCartItem(shoppingCartItem));
        } else {
            ShoppingCartItem shoppingCartItem = ShoppingCartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
            return new ShoppingCartItemDTO(saveShoppingCartItem(shoppingCartItem));
        }
    }
    @Transactional
    public void deleteUserShoppingCartItem(UUID id, User user) {
        ShoppingCartItem shoppingCartItem = findShoppingCartItemById(id);

        if (!shoppingCartItem.getUser().equals(user)) {
            throw new ForbiddenException("User do not contains this shopping cart item");
        }

        deleteShoppingCartItem(shoppingCartItem);
    }

    private void deleteShoppingCartItem(ShoppingCartItem shoppingCartItem){
        shoppingCartItemRepository.delete(shoppingCartItem);
    }

    private ShoppingCartItem findShoppingCartItemById(UUID id) {
        return shoppingCartItemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Shopping cart item with id: " + id + " do not exist"));
    }

    public boolean existsShoppingCartItemByProductAndUser(Product product, User user) {
        return shoppingCartItemRepository.existsShoppingCartItemByProductAndUser(product, user);
    }

    public ShoppingCartItem findShoppingCartItemByProductAndUser(Product product, User user) {
        return shoppingCartItemRepository.findShoppingCartItemByProductAndUser(product, user)
                .orElseThrow(() -> new NotFoundException(
                        "Shopping cart item with product: " + product.getName() + " for user do not exist"));
    }

    public ShoppingCartItem saveShoppingCartItem(ShoppingCartItem shoppingCartItem) {
        return shoppingCartItemRepository.save(shoppingCartItem);
    }

    public void clearUserShoppingCart(User user) {
        List<ShoppingCartItem> shoppingCartItems = getUserShoppingCartItems(user);
        for(ShoppingCartItem shoppingCartItem : shoppingCartItems){
            deleteShoppingCartItem(shoppingCartItem);
        }
    }
    @Transactional
    public ShoppingCartItemDTO updateUserShoppingCartItem(UUID id, Long newQuantity, User user) {
        ShoppingCartItem shoppingCartItem = findShoppingCartItemById(id);

        if (!shoppingCartItem.getUser().equals(user)) {
            throw new ForbiddenException("User do not contains this shopping cart item");
        }

        shoppingCartItem.setQuantity(newQuantity);
        return new ShoppingCartItemDTO(saveShoppingCartItem(shoppingCartItem));
    }
}
