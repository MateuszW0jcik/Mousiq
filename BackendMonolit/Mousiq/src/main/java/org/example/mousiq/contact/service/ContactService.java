package org.example.mousiq.contact.service;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.contact.model.dto.ContactDTO;
import org.example.mousiq.contact.model.entity.Contact;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.common.exception.ForbiddenException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.contact.model.request.ContactRequest;
import org.example.mousiq.contact.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;

    @Transactional
    public ContactDTO addContact(ContactRequest request, User user) {
        Contact contact = Contact.builder()
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .user(user).build();

        return new ContactDTO(saveContact(contact));
    }

    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact findContactById(UUID id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Contact with id: " + id + " do not exist"));
    }

    @Transactional
    public void deleteUserContact(UUID id, User user) {
        Contact contact = findContactById(id);

        if (!contact.getUser().equals(user)) {
            throw new ForbiddenException("User do not contains this contact");
        }

        deleteContact(contact);
    }

    public void deleteContact(Contact contact) {
        contactRepository.delete(contact);
    }

    @Transactional
    public ContactDTO editUserContact(UUID id, ContactRequest request, User user) {
        Contact contact = findContactById(id);

        if (!contact.getUser().equals(user)) {
            throw new ForbiddenException("User do not contains this contact");
        }

        contact.setEmail(request.email());
        contact.setPhoneNumber(request.phoneNumber());

        return new ContactDTO(saveContact(contact));
    }

    public List<ContactDTO> getUserContacts(User user) {
        return contactRepository.findContactsByUser(user)
                .stream()
                .map(ContactDTO::new)
                .collect(Collectors.toList());
    }
}