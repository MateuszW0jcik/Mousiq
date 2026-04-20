package org.example.mousiq.address.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.mousiq.user.model.entity.User;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String country;

    private String postalCode;

    private String city;

    private String street;

    private String streetNumber;
}
