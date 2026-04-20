package org.example.mousiq.product.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.brand.service.BrandService;
import org.example.mousiq.product.model.dto.ProductDTO;
import org.example.mousiq.product.model.dto.ProductSummaryDTO;
import org.example.mousiq.brand.model.entity.Brand;
import org.example.mousiq.product.model.entity.ConnectionType;
import org.example.mousiq.product.model.entity.Product;
import org.example.mousiq.product.model.entity.SensorType;
import org.example.mousiq.common.exception.BadRequestException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.product.model.request.ProductRequest;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandService brandService;
    private final Cloudinary cloudinary;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public ProductDTO addProduct(ProductRequest request, MultipartFile image) {
        Map<String, String> imageData = uploadImageToCloudinary(image);

        String slug = generateSlug(request.name());

        if (productRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 8);
        }

        Brand brand = brandService.findBrandByName(request.brandName());

        Product product = Product.builder()
                .name(request.name())
                .slug(slug)
                .brand(brand)
                .description(request.description())
                .dpi(request.dpi())
                .sensorType(request.sensorType())
                .wireless(request.wireless())
                .connectionType(request.connectionType())
                .numberOfButtons(request.numberOfButtons())
                .rgbLighting(request.rgbLighting())
                .weight(request.weight())
                .color(request.color())
                .programmableButtons(request.programmableButtons())
                .pollingRate(request.pollingRate())
                .gripType(request.gripType())
                .batteryLife(request.batteryLife())
                .price(request.price())
                .quantity(request.quantity())
                .addedAt(Instant.now())
                .imageUrl(imageData.get("url"))
                .imagePublicId(imageData.get("publicId"))
                .build();

        return new ProductDTO(productRepository.save(product));
    }

    @Transactional
    public ProductDTO editProduct(UUID id, ProductRequest request, MultipartFile image) {
        Product product = findProductById(id);

        Brand brand = brandService.findBrandByName(request.brandName());

        product.setName(request.name());
        product.setBrand(brand);
        product.setDescription(request.description());
        product.setDpi(request.dpi());
        product.setSensorType(request.sensorType());
        product.setWireless(request.wireless());
        product.setConnectionType(request.connectionType());
        product.setNumberOfButtons(request.numberOfButtons());
        product.setRgbLighting(request.rgbLighting());
        product.setWeight(request.weight());
        product.setColor(request.color());
        product.setProgrammableButtons(request.programmableButtons());
        product.setPollingRate(request.pollingRate());
        product.setGripType(request.gripType());
        product.setBatteryLife(request.batteryLife());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());

        String newSlug = generateSlug(request.name());
        if (!product.getSlug().equals(newSlug)) {
            if (productRepository.existsBySlug(newSlug)) {
                newSlug = newSlug + "-" + UUID.randomUUID().toString().substring(0, 8);
            }
            product.setSlug(newSlug);
        }

        if (image != null && !image.isEmpty()) {
            Map<String, String> imageData = uploadImageToCloudinary(image);
            product.setImageUrl(imageData.get("url"));
            product.setImagePublicId(imageData.get("publicId"));
        }

        return new ProductDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = findProductById(id);

        productRepository.delete(product);
    }

    public Product findProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product with id: " + id + " does not exist"));
    }

    public PageResponse<ProductSummaryDTO> getProducts(
            int pageNo, int pageSize, String sortBy, String sortDir,
            String name, List<String> brandNames, Boolean wireless,
            BigDecimal minPrice, BigDecimal maxPrice,
            String sensorType, String connectionType,
            Integer minDpi, Integer maxDpi) {

        StringBuilder jpql = new StringBuilder();
        jpql.append("SELECT p FROM Product p WHERE 1=1 ");

        Map<String, Object> parameters = new HashMap<>();

        if (name != null && !name.trim().isEmpty()) {
            jpql.append("AND LOWER(p.name) LIKE LOWER(:name) ");
            parameters.put("name", "%" + name.trim() + "%");
        }

        if (brandNames != null && !brandNames.isEmpty()) {
            List<UUID> brandIds = brandService.getBrandIdsByNames(brandNames);
            if (brandIds != null && !brandIds.isEmpty()) {
                jpql.append("AND p.brand.id IN :brandIds ");
                parameters.put("brandIds", brandIds);
            }
        }

        if (wireless != null) {
            jpql.append("AND p.wireless = :wireless ");
            parameters.put("wireless", wireless);
        }

        if (minPrice != null) {
            jpql.append("AND p.price >= :minPrice ");
            parameters.put("minPrice", minPrice);
        }

        if (maxPrice != null) {
            jpql.append("AND p.price <= :maxPrice ");
            parameters.put("maxPrice", maxPrice);
        }

        if (sensorType != null && !sensorType.trim().isEmpty()) {
            jpql.append("AND p.sensorType = :sensorType ");
            parameters.put("sensorType", SensorType.valueOf(sensorType.toUpperCase()));
        }

        if (connectionType != null && !connectionType.trim().isEmpty()) {
            jpql.append("AND p.connectionType = :connectionType ");
            parameters.put("connectionType", ConnectionType.valueOf(connectionType.toUpperCase()));
        }

        if (minDpi != null) {
            jpql.append("AND p.dpi >= :minDpi ");
            parameters.put("minDpi", minDpi);
        }

        if (maxDpi != null) {
            jpql.append("AND p.dpi <= :maxDpi ");
            parameters.put("maxDpi", maxDpi);
        }

        jpql.append("ORDER BY p.").append(sortBy).append(" ").append(sortDir.toUpperCase());

        TypedQuery<Product> query = entityManager.createQuery(jpql.toString(), Product.class);
        parameters.forEach(query::setParameter);

        query.setFirstResult(pageNo * pageSize);
        query.setMaxResults(pageSize);

        List<ProductSummaryDTO> content = query.getResultList().stream()
                .map(ProductSummaryDTO::new)
                .toList();

        String countJpql = jpql.toString()
                .replace("SELECT p", "SELECT COUNT(p)")
                .replaceAll("ORDER BY.*", "");

        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        parameters.forEach(countQuery::setParameter);

        Long totalElements = countQuery.getSingleResult();
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        return new PageResponse<>(
                content,
                pageNo,
                pageSize,
                totalElements,
                totalPages,
                pageNo >= totalPages - 1);
    }

    public List<ProductSummaryDTO> getNewProducts() {
        return productRepository.findTop8ByOrderByAddedAtDesc()
                .stream()
                .map(ProductSummaryDTO::new)
                .toList();
    }

    public List<ProductSummaryDTO> getBestSellersProducts() {
        return productRepository.findTop8ByOrderByAddedAtAsc()
                .stream()
                .map(ProductSummaryDTO::new)
                .toList();
    }

    public ProductDTO getProductById(UUID id) {
        return new ProductDTO(findProductById(id));
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Product with slug: " + slug + " does not exist"));
        return new ProductDTO(product);
    }

    private Map<String, String> uploadImageToCloudinary(MultipartFile image) {
        try {
            Map uploadResult = cloudinary.uploader().upload(image.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "products",
                            "resource_type", "image"
                    ));

            Map<String, String> result = new HashMap<>();
            result.put("url", (String) uploadResult.get("secure_url"));
            result.put("publicId", (String) uploadResult.get("public_id"));

            return result;
        } catch (Exception e) {
            throw new BadRequestException("Failed to upload image to Cloudinary: " + e.getMessage());
        }
    }

    private String generateSlug(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String ascii = normalized.replaceAll("[^\\p{ASCII}]", "");

        return ascii.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }

    @Transactional
    public void decreaseStock(UUID productId, Long quantity) {
        Product product = findProductById(productId);
        product.setQuantity((int) (product.getQuantity() - quantity));
        productRepository.save(product);
    }

    @Transactional
    public void increaseStock(UUID productId, Long quantity) {
        Product product = findProductById(productId);
        product.setQuantity((int) (product.getQuantity() + quantity));
        productRepository.save(product);
    }
}
