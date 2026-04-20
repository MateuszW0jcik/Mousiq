package org.example.authuserservice.user.controller;

import com.mousiq.common.annotation.CurrentUserId;
import com.mousiq.common.response.MessageResponse;
import com.mousiq.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.mousiq.common.dto.user.UserDTO;
import org.example.authuserservice.auth.model.dto.TokenPair;
import org.example.authuserservice.auth.model.response.MeResponse;
import org.example.authuserservice.auth.model.response.RefreshResponse;
import org.example.authuserservice.auth.model.entity.Role;
import org.example.authuserservice.auth.service.RefreshTokenService;
import org.example.authuserservice.user.model.dto.UserAdminOnlyDTO;
import org.example.authuserservice.user.model.entity.User;
import org.example.authuserservice.user.model.request.ChangeUserLoginEmailRequest;
import org.example.authuserservice.user.model.request.ChangeUserPasswordRequest;
import org.example.authuserservice.user.model.request.ChangeUserStatusRequest;
import org.example.authuserservice.user.model.request.EditUserFullNameRequest;
import org.example.authuserservice.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Collectors;

@Tag(name = "Users", description = "Endpoints for managing user accounts")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    @Operation(
            summary = "Get all users",
            description = "Returns paginated list of all users with optional name filtering (Admin only)"
    )
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<UserAdminOnlyDTO>> getUsers(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @Parameter(description = "Page size")
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field")
            @RequestParam(value = "sortBy", defaultValue = "username", required = false) String sortBy,
            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir,
            @Parameter(description = "Filter by name (firstName or lastName)")
            @RequestParam(value = "name", required = false) String name
    ) {
        return ResponseEntity.ok(userService.getUsers(page, size, sortBy, sortDir, name));
    }

    @Operation(
            summary = "Get current user info",
            description = "Returns basic information about the authenticated user"
    )
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MeResponse> getMe(
            @CurrentUserId UUID userId
    ) {
        User user = userService.findUserById(userId);
        return ResponseEntity.ok(new MeResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toList())
        ));
    }

    @Operation(
            summary = "Change user status",
            description = "Activates or deactivates a user account (Admin only)"
    )
    @PutMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> changeUserStatus(
            @Valid @RequestBody ChangeUserStatusRequest request
    ) {
        userService.changeUserStatus(request);
        return ResponseEntity.ok(new MessageResponse("User status changed successfully"));
    }

    @Operation(
            summary = "Update user name",
            description = "Updates the first name and last name of the authenticated user"
    )
    @PutMapping("/name")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> editUserFullName(
            @Valid @RequestBody EditUserFullNameRequest request,
            @CurrentUserId UUID userId
    ) {
        User user = userService.findUserById(userId);
        return ResponseEntity.ok(userService.editUserFullName(request, user));
    }

    @Operation(
            summary = "Change password",
            description = "Changes the password for the authenticated user"
    )
    @PutMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> changeUserPassword(
            @Valid @RequestBody ChangeUserPasswordRequest request,
            @CurrentUserId UUID userId
    ) {
        User user = userService.findUserById(userId);
        userService.changeUserPassword(request, user);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    @Operation(
            summary = "Change email/username",
            description = "Changes the login email/username for the authenticated user. Returns new tokens."
    )
    @PutMapping("/email")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RefreshResponse> changeUserLoginEmail(
            @Valid @RequestBody ChangeUserLoginEmailRequest request,
            @CurrentUserId UUID userId
    ) {
        User user = userService.findUserById(userId);
        userService.changeUserLoginEmail(request, user);
        TokenPair tokens = refreshTokenService.createNewTokensForUser(user);
        return ResponseEntity.ok(
                new RefreshResponse(tokens.getAccessToken(), tokens.getRefreshToken())
        );
    }
}
