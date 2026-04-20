package org.example.authuserservice.contact.repository;

import org.example.authuserservice.contact.model.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findContactsByUserId(UUID userId);
}
