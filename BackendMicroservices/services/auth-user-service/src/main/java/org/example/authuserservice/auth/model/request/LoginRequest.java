package org.example.authuserservice.auth.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest (
        @NotBlank(message = "Email can't be empty")
        @Email(message = "Incorrect email format")
        String email,

        @NotBlank(message = "Password can't be empty")
        String password
){}
