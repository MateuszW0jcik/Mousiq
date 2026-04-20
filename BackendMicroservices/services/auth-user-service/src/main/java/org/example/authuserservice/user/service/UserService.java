package org.example.authuserservice.user.service;

import com.mousiq.common.dto.user.UserDTO;
import com.mousiq.common.exception.BadRequestException;
import com.mousiq.common.exception.InternalServerErrorException;
import com.mousiq.common.exception.NotFoundException;
import com.mousiq.common.response.PageResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.auth.model.entity.Role;
import org.example.authuserservice.user.mapper.UserMapper;
import org.example.authuserservice.user.model.dto.UserAdminOnlyDTO;
import org.example.authuserservice.user.model.entity.User;
import org.example.authuserservice.user.model.request.ChangeUserLoginEmailRequest;
import org.example.authuserservice.user.model.request.ChangeUserPasswordRequest;
import org.example.authuserservice.user.model.request.ChangeUserStatusRequest;
import org.example.authuserservice.user.model.request.EditUserFullNameRequest;
import org.example.authuserservice.user.repository.UserRepository;
import org.example.authuserservice.auth.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Transactional
    public UserDTO editUserFullName(EditUserFullNameRequest request, User user) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        saveUser(user);

        return userMapper.toDTO(user);
    }

    @Transactional
    public void changeUserPassword(ChangeUserPasswordRequest request, User user) {
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid old password");
        }

        if (!request.newPassword().equals(request.repeatedPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        saveUser(user);
    }

    @Transactional
    public void changeUserLoginEmail(ChangeUserLoginEmailRequest request, User user) {
        if (existsByEmail(request.email())) {
            throw new BadRequestException("User with this email already exists");
        }

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        user.setEmail(request.email());
        user.setUsername(request.email());
        saveUser(user);
    }

    public PageResponse<UserAdminOnlyDTO> getUsers(int pageNo, int pageSize, String sortBy, String sortDir, String name) {
        Sort sort;

        if (sortBy.equalsIgnoreCase("name")) {
            Sort.Order firstNameOrder = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                    ? Sort.Order.asc("firstName").ignoreCase()
                    : Sort.Order.desc("firstName").ignoreCase();
            Sort.Order lastNameOrder = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                    ? Sort.Order.asc("lastName").ignoreCase()
                    : Sort.Order.desc("lastName").ignoreCase();
            Sort.Order emailOrder = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                    ? Sort.Order.asc("email").ignoreCase()
                    : Sort.Order.desc("email").ignoreCase();
            sort = Sort.by(lastNameOrder).and(Sort.by(firstNameOrder)).and(Sort.by(emailOrder));
        } else {
            sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                    Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        }

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<User> users;

        users = userRepository.findByName(name.trim(), pageable);

        List<UserAdminOnlyDTO> content = users.getContent()
                .stream()
                .map(userMapper::toAdminDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages(),
                users.isLast());
    }

    public List<User> getUsersByName(String name) {
        return userRepository.findByName(name);
    }

    @Transactional
    public void changeUserStatus(ChangeUserStatusRequest request) {
        User user = findUserById(request.userId());
        user.setActive(request.active());
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new InternalServerErrorException("Server problem"));
        if (request.admin() && user.getRoles().stream().noneMatch(role -> "ADMIN".equals(role.getName()))) {
            user.addRole(adminRole);
        } else if (!request.admin() && user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()))) {
            user.removeRole(adminRole);
        }
        saveUser(user);
    }

    public UserDTO getUserById(UUID id) {
        return userMapper.toDTO(findUserById(id));
    }
}
