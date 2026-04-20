package org.example.productservice.brand.service;

import com.mousiq.common.dto.product.BrandDTO;
import com.mousiq.common.exception.BadRequestException;
import com.mousiq.common.exception.NotFoundException;
import com.mousiq.common.response.PageResponse;
import lombok.AllArgsConstructor;
import org.example.productservice.brand.mapper.BrandMapper;
import org.example.productservice.brand.model.entity.Brand;
import org.example.productservice.brand.model.request.BrandRequest;
import org.example.productservice.brand.repository.BrandRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Transactional
    public BrandDTO addBrand(BrandRequest request) {
        if (brandRepository.existsBrandByName(request.name())) {
            throw new BadRequestException("Brand with name: " + request.name() + " already exist");
        }

        Brand brand = Brand.builder()
                .name(request.name()).build();

        return brandMapper.toDTO(brandRepository.save(brand));
    }

    @Transactional
    public BrandDTO editBrand(UUID id, BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Brand with id: " + id + " do not exist"));

        brand.setName(request.name());

        return brandMapper.toDTO(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(UUID id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Brand with id: " + id + " do not exist"));

        brandRepository.delete(brand);
    }

    public Brand findBrandByName(String name) {
        return brandRepository.findBrandByName(name)
                .orElseThrow(() -> new NotFoundException("Brand with name: " + name + " do not exist"));
    }

    public Brand findBrandById(UUID id) {
        return brandRepository.findBrandById(id)
                .orElseThrow(() -> new NotFoundException("Brand with id: " + id + " do not exist"));
    }

    public PageResponse<BrandDTO> getBrands(int pageNo, int pageSize, String sortBy, String sortDir, String name) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Brand> brands = brandRepository.findByNameContainingIgnoreCase(name, pageable);

        List<BrandDTO> content = brands.getContent()
                .stream()
                .map(brandMapper::toDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                brands.getNumber(),
                brands.getSize(),
                brands.getTotalElements(),
                brands.getTotalPages(),
                brands.isLast());
    }

    public List<UUID> getBrandIdsByNames(List<String> brandNames) {
        return brandRepository.findBrandsByNameIn(brandNames).stream().map(Brand::getId).collect(Collectors.toList());
    }

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream().map(brandMapper::toDTO).collect(Collectors.toList());
    }
}
