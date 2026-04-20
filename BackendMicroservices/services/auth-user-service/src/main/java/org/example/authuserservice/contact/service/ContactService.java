package org.example.authuserservice.contact.service;

import com.mousiq.common.dto.contact.AdminContactDTO;
import com.mousiq.common.exception.ForbiddenException;
import com.mousiq.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.contact.mapper.ContactMapper;
import org.example.authuserservice.contact.model.dto.ContactDTO;
import org.example.authuserservice.contact.model.entity.Contact;
import org.example.authuserservice.contact.model.request.ContactRequest;
import org.example.authuserservice.contact.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    @Transactional
    public ContactDTO addContact(ContactRequest request, UUID userId) {
        Contact contact = Contact.builder()
                .email(request.email())
                .phoneNumber(request.phoneNumber())
                .userId(userId).build();

        return contactMapper.toDTO(saveContact(contact));
    }

    @Transactional
    public void deleteUserContact(UUID id, UUID userId) {
        Contact contact = findContactById(id);

        if (!contact.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this contact");
        }

        deleteContact(contact);
    }

    @Transactional
    public ContactDTO editUserContact(UUID id, ContactRequest request, UUID userId) {
        Contact contact = findContactById(id);

        if (!contact.getUserId().equals(userId)) {
            throw new ForbiddenException("User do not contains this contact");
        }

        contact.setEmail(request.email());
        contact.setPhoneNumber(request.phoneNumber());

        return contactMapper.toDTO(saveContact(contact));
    }

    public List<ContactDTO> getUserContacts(UUID userId) {
        return contactRepository.findContactsByUserId(userId)
                .stream()
                .map(contactMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Contact findContactById(UUID id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Contact with id: " + id + " do not exist"));
    }

    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public void deleteContact(Contact contact) {
        contactRepository.delete(contact);
    }

    public AdminContactDTO getAdminContactById(UUID id) {
        return contactMapper.toAdminDTO(findContactById(id));
    }
}