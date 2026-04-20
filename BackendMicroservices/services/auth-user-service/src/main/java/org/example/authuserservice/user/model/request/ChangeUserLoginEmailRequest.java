package org.example.authuserservice.user.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ChangeUserLoginEmailRequest(
        @NotBlank(message = "Current password can't be empty")
        String currentPassword,
        @NotBlank(message = "Email can't be empty")
        @Email(message = "Incorrect email format")
        String email
) {
}
