package org.example.authuserservice.address.controller;

import com.mousiq.common.annotation.CurrentUserId;
import com.mousiq.common.response.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.address.model.dto.AddressDTO;
import org.example.authuserservice.address.model.request.AddressRequest;
import org.example.authuserservice.address.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Addresses", description = "Endpoints for managing user addresses")
@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @Operation(
            summary = "Get user addresses",
            description = "Returns all addresses for the authenticated user"
    )
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressDTO>> getUserAddresses(
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity.ok(addressService.getUserAddresses(userId));
    }

    @Operation(
            summary = "Add new address",
            description = "Creates a new address for the authenticated user"
    )
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressDTO> addAddress(
            @Valid @RequestBody AddressRequest request,
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(addressService.addAddress(request, userId));
    }

    @Operation(
            summary = "Update address",
            description = "Updates an existing address for the authenticated user"
    )
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressDTO> editUserAddress(
            @Parameter(description = "Address UUID")
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequest request,
            @CurrentUserId UUID userId
    ) {
        return ResponseEntity.ok(addressService.editUserAddress(id, request, userId));
    }

    @Operation(
            summary = "Delete address",
            description = "Deletes a address for the authenticated user"
    )
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUserAddress(
            @Parameter(description = "Address UUID")
            @PathVariable UUID id,
            @CurrentUserId UUID userId
    ) {
        addressService.deleteUserAddress(id, userId);
        return ResponseEntity.noContent().build();
    }
}
