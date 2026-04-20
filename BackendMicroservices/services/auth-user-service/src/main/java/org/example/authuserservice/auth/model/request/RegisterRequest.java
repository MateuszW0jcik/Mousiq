package org.example.authuserservice.auth.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest (
        @NotBlank(message = "First name can't be empty")
        String firstName,

        @NotBlank(message = "Last name can't be empty")
        String lastName,

        @NotBlank(message = "Email can't be empty")
        @Email(message = "Incorrect email format")
        String email,

        @NotBlank(message = "Password can't be empty")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password
){}
