package org.example.authuserservice.auth.model.request;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank(message = "RefreshToken can't be empty")
        String refreshToken
) {
}
