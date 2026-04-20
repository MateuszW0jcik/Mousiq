package org.example.mousiq.message.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.message.model.dto.MessageDTO;
import org.example.mousiq.message.model.request.MessageRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.message.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Tag(name = "Messages", description = "Endpoints for customer contact messages")
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @Operation(
            summary = "Get all messages",
            description = "Returns paginated list of customer messages (Admin only)"
    )
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<MessageDTO>> getMessages(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field")
            @RequestParam(value = "sortBy", defaultValue = "sentAt", required = false) String sortBy,
            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
    ) {
        return ResponseEntity.ok(messageService.getMessages(page, size, sortBy, sortDir));
    }

    @Operation(
            summary = "Send contact message",
            description = "Sends a contact message to the store. Can be sent by authenticated users or guests."
    )
    @PostMapping
    public ResponseEntity<MessageDTO> createMessage(
            @Valid @RequestBody MessageRequest request
    ) {
        MessageDTO message = messageService.createMessage(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(message);
    }

    @Operation(
            summary = "Delete message",
            description = "Deletes a customer message (Admin only)"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(
            @Parameter(description = "Message UUID")
            @PathVariable UUID id
    ) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
