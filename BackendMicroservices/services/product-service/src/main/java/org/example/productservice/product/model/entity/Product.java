package org.example.productservice.product.model.entity;

import com.mousiq.common.enums.product.ConnectionType;
import com.mousiq.common.enums.product.GripType;
import com.mousiq.common.enums.product.SensorType;
import jakarta.persistence.*;
import lombok.*;
import org.example.productservice.brand.model.entity.Brand;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String slug;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer dpi;

    @Enumerated(EnumType.STRING)
    private SensorType sensorType;

    private Boolean wireless;

    @Enumerated(EnumType.STRING)
    private ConnectionType connectionType;

    private Integer numberOfButtons;

    private Boolean rgbLighting;

    private Integer weight;

    private String color;

    private Boolean programmableButtons;

    private Integer pollingRate;

    @Enumerated(EnumType.STRING)
    private GripType gripType;

    private Integer batteryLife;

    private BigDecimal price;

    private Integer quantity;

    private Instant addedAt;

    private String imageUrl;

    private String imagePublicId;
}
