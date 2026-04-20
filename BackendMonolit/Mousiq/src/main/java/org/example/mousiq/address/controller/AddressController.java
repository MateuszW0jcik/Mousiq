package org.example.mousiq.address.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.address.model.dto.AddressDTO;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.address.model.request.AddressRequest;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.address.service.AddressService;
import org.example.mousiq.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "Addresses", description = "Endpoints for managing user addresses")
@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;
    private final UserService userService;

    @Operation(
            summary = "Get user addresses",
            description = "Returns all addresses for the authenticated user"
    )
    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(addressService.getUserAddresses(user));
    }

    @Operation(
            summary = "Add new address",
            description = "Creates a new address for the authenticated user"
    )
    @PostMapping
    public ResponseEntity<AddressDTO> addAddress(
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        AddressDTO address = addressService.addAddress(request, user);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(address);
    }

    @Operation(
            summary = "Update address",
            description = "Updates an existing address for the authenticated user"
    )
    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> editUserAddress(
            @Parameter(description = "Address UUID")
            @PathVariable UUID id,
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        AddressDTO address = addressService.editUserAddress(id, request, user);
        return ResponseEntity.ok(address);
    }

    @Operation(
            summary = "Delete address",
            description = "Deletes a address for the authenticated user"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAddress(
            @Parameter(description = "Address UUID")
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        addressService.deleteUserAddress(id, user);
        return ResponseEntity.noContent().build();
    }
}
