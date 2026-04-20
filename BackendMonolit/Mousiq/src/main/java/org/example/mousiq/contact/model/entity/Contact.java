package org.example.mousiq.contact.model.entity;

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
@Table(name = "contacts")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String email;

    private String phoneNumber;
}
