package org.example.authuserservice.contact.controller;

import com.mousiq.common.dto.contact.AdminContactDTO;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.contact.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/internal/contacts")
@RequiredArgsConstructor
public class InternalContactController {
    private final ContactService contactService;

    @GetMapping("/{id}")
    public ResponseEntity<AdminContactDTO> getContactById(
            @Parameter(description = "Contact UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(contactService.getAdminContactById(id));
    }
}
