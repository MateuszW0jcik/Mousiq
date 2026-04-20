package org.example.mousiq.seeder;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.contact.model.entity.Contact;
import org.example.mousiq.contact.repository.ContactRepository;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.user.repository.UserRepository;
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
            Contact contact = Contact.builder()
                    .user(user)
                    .email(user.getEmail())
                    .phoneNumber("123456789")
                    .build();

            contactRepository.save(contact);
        }
    }
}
