package org.example.mousiq.user.model.dto;

import lombok.*;
import org.example.mousiq.user.model.entity.User;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAdminOnlyDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private boolean admin;
    private boolean active;
    private Instant createdAt;

    public UserAdminOnlyDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.admin = user.getRoles().stream()
                .anyMatch(role -> "ADMIN".equals(role.getName()));
        this.active = user.isActive();
        this.createdAt = user.getCreatedAt();
    }
}
