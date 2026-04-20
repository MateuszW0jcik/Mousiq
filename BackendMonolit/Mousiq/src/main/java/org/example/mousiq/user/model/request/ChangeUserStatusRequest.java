package org.example.mousiq.user.model.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ChangeUserStatusRequest (
        @NotNull(message = "User id is required")
        UUID userId,
        @NotNull(message = "Admin is required")
        boolean admin,
        @NotNull(message = "Active is required")
        boolean active
){}
