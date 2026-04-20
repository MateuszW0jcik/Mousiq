package org.example.mousiq.contact.repository;

import org.example.mousiq.contact.model.entity.Contact;
import org.example.mousiq.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findContactsByUser(User user);
}
