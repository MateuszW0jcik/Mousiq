package org.example.authuserservice.user.mapper;

import com.mousiq.common.dto.user.UserDTO;
import org.example.authuserservice.user.model.dto.UserAdminOnlyDTO;
import org.example.authuserservice.user.model.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail()).build();
    }

    public UserAdminOnlyDTO toAdminDTO(User user){
        if (user == null) {
            return null;
        }

        return UserAdminOnlyDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .admin(user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName())))
                .active(user.isActive())
                .createdAt(user.getCreatedAt()).build();
    }
}
