package org.example.mousiq.contact.model.dto;

import lombok.*;
import org.example.mousiq.contact.model.entity.Contact;

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

    public ContactDTO(Contact contact) {
        this.id = contact.getId();
        this.email = contact.getEmail();
        this.phoneNumber = contact.getPhoneNumber();
    }
}
