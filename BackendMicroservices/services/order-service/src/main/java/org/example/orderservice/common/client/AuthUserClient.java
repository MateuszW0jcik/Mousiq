package org.example.orderservice.common.client;

import com.mousiq.common.dto.address.AdminAddressDTO;
import com.mousiq.common.dto.contact.AdminContactDTO;
import com.mousiq.common.dto.user.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "AUTH-USER-SERVICE")
public interface AuthUserClient {

    @GetMapping("/internal/users/{id}")
    UserDTO getUserById(@PathVariable("id") UUID userId);

    @GetMapping("/internal/contacts/{id}")
    AdminContactDTO getContactById(@PathVariable("id") UUID id);

    @GetMapping("/internal/addresses/{id}")
    AdminAddressDTO getAddressById(@PathVariable("id") UUID id);
}
