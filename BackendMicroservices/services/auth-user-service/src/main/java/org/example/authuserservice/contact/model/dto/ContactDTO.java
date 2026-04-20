package org.example.authuserservice.contact.model.dto;

import lombok.*;
import org.example.authuserservice.contact.model.entity.Contact;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {
    private UUID id;
    private String email;
    private String phoneNumber;
}
