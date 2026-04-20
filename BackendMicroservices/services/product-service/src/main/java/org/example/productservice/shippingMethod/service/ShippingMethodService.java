package org.example.productservice.shippingMethod.service;

import com.mousiq.common.dto.shippingMethod.ShippingMethodDTO;
import com.mousiq.common.exception.NotFoundException;
import com.mousiq.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.example.productservice.shippingMethod.mapper.ShippingMethodMapper;
import org.example.productservice.shippingMethod.model.entity.ShippingMethod;
import org.example.productservice.shippingMethod.model.request.ShippingMethodRequest;
import org.example.productservice.shippingMethod.repository.ShippingMethodRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingMethodService {
    private final ShippingMethodRepository shippingMethodRepository;
    private final ShippingMethodMapper shippingMethodMapper;

    public ShippingMethod findShippingMethodById(UUID id) {
        return shippingMethodRepository.findShippingMethodById(id)
                .orElseThrow(() -> new NotFoundException("Shipping method with id: " + id + " do not exist"));
    }

    public PageResponse<ShippingMethodDTO> getShippingMethods(int pageNo, int pageSize, String sortBy, String sortDir, String name) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<ShippingMethod> shippingMethods = shippingMethodRepository.findByNameContainingIgnoreCase(name, pageable);

        List<ShippingMethodDTO> content = shippingMethods.getContent()
                .stream()
                .map(shippingMethodMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                shippingMethods.getNumber(),
                shippingMethods.getSize(),
                shippingMethods.getTotalElements(),
                shippingMethods.getTotalPages(),
                shippingMethods.isLast());
    }

    public List<ShippingMethodDTO> getAllShippingMethods() {
        return shippingMethodRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(ShippingMethod::getPrice).reversed())
                .map(shippingMethodMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ShippingMethodDTO addShippingMethod(ShippingMethodRequest request) {
        ShippingMethod shippingMethod = ShippingMethod.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price()).build();

        return shippingMethodMapper.toDTO(shippingMethodRepository.save(shippingMethod));
    }

    @Transactional
    public ShippingMethodDTO editShippingMethod(UUID id, ShippingMethodRequest request) {
        ShippingMethod shippingMethod = findShippingMethodById(id);

        shippingMethod.setName(request.name());
        shippingMethod.setDescription(request.description());
        shippingMethod.setPrice(request.price());

        return shippingMethodMapper.toDTO(shippingMethodRepository.save(shippingMethod));
    }

    @Transactional
    public void deleteShippingMethod(UUID id) {
        ShippingMethod shippingMethod = findShippingMethodById(id);

        shippingMethodRepository.delete(shippingMethod);
    }

    public ShippingMethodDTO getShippingMethodById(UUID id) {
        return shippingMethodMapper.toDTO(findShippingMethodById(id));
    }
}
