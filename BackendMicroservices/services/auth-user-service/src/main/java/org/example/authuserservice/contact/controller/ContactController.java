package org.example.authuserservice.contact.controller;

import com.mousiq.common.annotation.CurrentUserId;
import com.mousiq.common.response.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.contact.model.dto.ContactDTO;
import org.example.authuserservice.contact.model.request.ContactRequest;
import org.example.authuserservice.contact.service.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Contacts", description = "Endpoints for managing user contact information")
@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService contactService;

    @Operation(
            summary = "Get user contacts",
            description = "Returns all contact information for the authenticated user"
    )
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ContactDTO>> getUserContacts(
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity.ok(contactService.getUserContacts(userId));
    }

    @Operation(
            summary = "Add new contact",
            description = "Creates new contact information for the authenticated user"
    )
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ContactDTO> addContact(
            @Valid @RequestBody ContactRequest request,
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(contactService.addContact(request, userId));
    }

    @Operation(
            summary = "Update contact",
            description = "Updates existing contact information for the authenticated user"
    )
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ContactDTO> editUserContact(
            @Parameter(description = "Contact UUID")
            @PathVariable UUID id,
            @Valid @RequestBody ContactRequest request,
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity.ok(contactService.editUserContact(id, request, userId));
    }

    @Operation(
            summary = "Delete contact",
            description = "Deletes contact information for the authenticated user"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUserContact(
            @Parameter(description = "Contact UUID")
            @PathVariable UUID id,
            @CurrentUserId UUID userId
    ) {
        contactService.deleteUserContact(id, userId);
        return ResponseEntity.noContent().build();
    }
}
