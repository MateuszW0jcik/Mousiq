package org.example.authuserservice.user.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeUserPasswordRequest(
        @NotBlank(message = "Old password can't be empty")
        String oldPassword,
        @NotBlank(message = "New password can't be empty")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String newPassword,
        @NotBlank(message = "Repeated password can't be empty")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String repeatedPassword
) {
}
