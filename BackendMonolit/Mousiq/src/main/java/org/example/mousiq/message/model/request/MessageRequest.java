package org.example.mousiq.message.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record MessageRequest(
        @NotBlank(message = "Content can't be empty")
        String content,
        String name,
        @Email(message = "Email should be valid")
        String email
){}
