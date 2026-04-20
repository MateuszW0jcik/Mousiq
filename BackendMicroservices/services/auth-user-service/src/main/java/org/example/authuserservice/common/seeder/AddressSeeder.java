package org.example.authuserservice.common.seeder;

import lombok.RequiredArgsConstructor;
import org.example.authuserservice.address.model.entity.Address;
import org.example.authuserservice.address.repository.AddressRepository;
import org.example.authuserservice.user.model.entity.User;
import org.example.authuserservice.user.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("test")
@RequiredArgsConstructor
public class AddressSeeder {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public void seed(){
        List<User> users = userRepository.findAll();

        for (User user : users) {
            Address address = Address.builder()
                    .userId(user.getId())
                    .country("test")
                    .postalCode("test")
                    .city("test")
                    .street("test")
                    .streetNumber("10a")
                    .build();

            addressRepository.save(address);
        }
    }
}
