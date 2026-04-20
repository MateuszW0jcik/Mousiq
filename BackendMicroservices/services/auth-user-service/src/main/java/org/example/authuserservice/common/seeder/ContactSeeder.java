package org.example.authuserservice.common.seeder;

import lombok.RequiredArgsConstructor;
import org.example.authuserservice.contact.model.entity.Contact;
import org.example.authuserservice.contact.repository.ContactRepository;
import org.example.authuserservice.user.model.entity.User;
import org.example.authuserservice.user.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("test")
@RequiredArgsConstructor
public class ContactSeeder {
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    public void seed(){
        List<User> users = userRepository.findAll();

        for (User user : users) {
            Contact address = Contact.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .phoneNumber("123456789")
                    .build();

            contactRepository.save(address);
        }
    }
}
