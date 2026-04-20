package org.example.authuserservice.contact.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ContactRequest(
        @Email(message = "Email should be valid")
        @NotNull(message = "Email is required")
        String email,
        @Pattern(
                regexp = "\\+?[0-9]{7,15}",
                message = "Phone number should be valid and contain 7 to 15 digits, optionally starting with '+'"
        )
        @NotNull(message = "Phone number is required")
        String phoneNumber
) {
}