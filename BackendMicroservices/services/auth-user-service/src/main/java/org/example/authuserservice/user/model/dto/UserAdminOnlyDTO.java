package org.example.authuserservice.user.model.dto;

import lombok.*;
import org.example.authuserservice.user.model.entity.User;

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
}
