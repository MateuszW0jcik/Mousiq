package org.example.authuserservice.common.config;

import lombok.RequiredArgsConstructor;
import org.example.authuserservice.auth.model.entity.Role;
import org.example.authuserservice.auth.repository.RoleRepository;
import org.example.authuserservice.user.model.entity.User;
import org.example.authuserservice.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Order(1)
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.email}")
    private String adminEmail;

    @Override
    public void run(String... args) {
        initRoles();
        createAdminIfNotExists();
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

    private void createAdminIfNotExists() {
        if (!userRepository.existsByEmail(adminEmail) && !adminEmail.equals("email")) {
            User admin = new User();
            admin.setUsername(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEmail(adminEmail);
            admin.setFirstName("Admin");
            admin.setLastName("Admin");
            admin.setCreatedAt(Instant.now());
            admin.setActive(true);

            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found")));
            roles.add(roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("USER role not found")));

            admin.setRoles(roles);
            userRepository.save(admin);
        }
    }
}
