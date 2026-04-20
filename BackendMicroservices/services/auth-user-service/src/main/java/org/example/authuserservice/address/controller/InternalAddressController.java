package org.example.authuserservice.address.controller;

import com.mousiq.common.dto.address.AdminAddressDTO;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.address.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Hidden
@RestController
@RequestMapping("/internal/addresses")
@RequiredArgsConstructor
public class InternalAddressController {
    private final AddressService addressService;

    @GetMapping("/{id}")
    public ResponseEntity<AdminAddressDTO> getAddressById(
            @Parameter(description = "Address UUID")
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(addressService.getAdminAddressById(id));
    }
}
