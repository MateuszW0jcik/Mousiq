package org.example.mousiq.product.model.dto;

import lombok.*;
import org.example.mousiq.brand.model.dto.BrandDTO;
import org.example.mousiq.product.model.entity.ConnectionType;
import org.example.mousiq.product.model.entity.GripType;
import org.example.mousiq.product.model.entity.Product;
import org.example.mousiq.product.model.entity.SensorType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private UUID id;
    private String name;
    private String slug;
    private BrandDTO brand;
    private String description;

    private Integer dpi;
    private SensorType sensorType;
    private Boolean wireless;
    private ConnectionType connectionType;
    private Integer numberOfButtons;
    private Boolean rgbLighting;
    private Integer weight;
    private String color;
    private Boolean programmableButtons;
    private Integer pollingRate;
    private GripType gripType;
    private Integer batteryLife;

    private BigDecimal price;
    private Integer quantity;
    private Instant addedAt;

    private String imageUrl;
    private String imagePublicId;

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.slug = product.getSlug();
        this.brand = product.getBrand() != null ? new BrandDTO(product.getBrand()) : null;
        this.description = product.getDescription();
        this.dpi = product.getDpi();
        this.sensorType = product.getSensorType();
        this.wireless = product.getWireless();
        this.connectionType = product.getConnectionType();
        this.numberOfButtons = product.getNumberOfButtons();
        this.rgbLighting = product.getRgbLighting();
        this.weight = product.getWeight();
        this.color = product.getColor();
        this.programmableButtons = product.getProgrammableButtons();
        this.pollingRate = product.getPollingRate();
        this.gripType = product.getGripType();
        this.batteryLife = product.getBatteryLife();
        this.price = product.getPrice();
        this.quantity = product.getQuantity();
        this.addedAt = product.getAddedAt();
        this.imageUrl = product.getImageUrl();
        this.imagePublicId = product.getImagePublicId();
    }
}
