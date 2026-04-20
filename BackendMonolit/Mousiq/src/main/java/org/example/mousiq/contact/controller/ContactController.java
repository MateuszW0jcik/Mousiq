package org.example.mousiq.contact.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.contact.model.dto.ContactDTO;
import org.example.mousiq.contact.model.request.ContactRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.contact.service.ContactService;
import org.example.mousiq.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Contacts", description = "Endpoints for managing user contact information")
@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;
    private final UserService userService;

    @Operation(
            summary = "Get user contacts",
            description = "Returns all contact information for the authenticated user"
    )
    @GetMapping
    public ResponseEntity<List<ContactDTO>> getUserContacts(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(contactService.getUserContacts(user));
    }

    @Operation(
            summary = "Add new contact",
            description = "Creates new contact information for the authenticated user"
    )
    @PostMapping
    public ResponseEntity<ContactDTO> addContact(
            @Valid @RequestBody ContactRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        ContactDTO contact = contactService.addContact(request, user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(contact);
    }

    @Operation(
            summary = "Update contact",
            description = "Updates existing contact information for the authenticated user"
    )
    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> editUserContact(
            @Parameter(description = "Contact UUID")
            @PathVariable UUID id,
            @Valid @RequestBody ContactRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        ContactDTO contact = contactService.editUserContact(id, request, user);
        return ResponseEntity.ok(contact);
    }

    @Operation(
            summary = "Delete contact",
            description = "Deletes contact information for the authenticated user"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserContact(
            @Parameter(description = "Contact UUID")
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        contactService.deleteUserContact(id, user);
        return ResponseEntity.noContent().build();
    }
}
