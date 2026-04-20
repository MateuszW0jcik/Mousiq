package org.example.mousiq.seeder;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.auth.model.entity.Role;
import org.example.mousiq.auth.repository.RoleRepository;
import org.example.mousiq.common.exception.InternalServerErrorException;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.user.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@Profile("test")
@RequiredArgsConstructor
public class UserSeeder {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public void seed(){
        initRoles();

        for (int i = 1; i <= 500; i++) {
            String email = "user" + i + "@test.com";
            User user = User.builder()
                    .firstName("Test")
                    .lastName("Test")
                    .username(email)
                    .email(email)
                    .password(passwordEncoder.encode("password"))
                    .active(true)
                    .createdAt(Instant.now())
                    .build();

            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new InternalServerErrorException("Server problem"));
            user.addRole(userRole);

            userRepository.save(user);
        }
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
        }
    }
}
