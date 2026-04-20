package org.example.authuserservice.contact.mapper;

import com.mousiq.common.dto.contact.AdminContactDTO;
import org.example.authuserservice.contact.model.dto.ContactDTO;
import org.example.authuserservice.contact.model.entity.Contact;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ContactMapper {
    public ContactDTO toDTO(Contact contact) {
        if (contact == null) {
            return null;
        }

        return ContactDTO.builder()
                .id(contact.getId())
                .email(contact.getEmail())
                .phoneNumber(contact.getPhoneNumber()).build();
    }

    public AdminContactDTO toAdminDTO(Contact contact){
        if (contact == null) {
            return null;
        }

        return AdminContactDTO.builder()
                .id(contact.getId())
                .userId(contact.getUserId())
                .email(contact.getEmail())
                .phoneNumber(contact.getPhoneNumber()).build();
    }
}
