package org.example.authuserservice.user.model.request;

import jakarta.validation.constraints.NotBlank;

public record EditUserFullNameRequest(
        @NotBlank(message = "First name can't be empty")
        String firstName,
        @NotBlank(message = "Last name can't be empty")
        String lastName
) {
}
