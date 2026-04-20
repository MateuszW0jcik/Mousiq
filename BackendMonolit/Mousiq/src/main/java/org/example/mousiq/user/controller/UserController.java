package org.example.mousiq.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.mousiq.auth.model.dto.TokenPair;
import org.example.mousiq.user.model.dto.UserAdminOnlyDTO;
import org.example.mousiq.user.model.dto.UserDTO;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.auth.model.entity.Role;
import org.example.mousiq.user.model.request.ChangeUserLoginEmailRequest;
import org.example.mousiq.user.model.request.ChangeUserPasswordRequest;
import org.example.mousiq.user.model.request.ChangeUserStatusRequest;
import org.example.mousiq.user.model.request.EditUserFullNameRequest;
import org.example.mousiq.common.response.MeResponse;
import org.example.mousiq.common.response.MessageResponse;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.common.response.RefreshResponse;
import org.example.mousiq.auth.service.RefreshTokenService;
import org.example.mousiq.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<MeResponse> getMe(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
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
    public ResponseEntity<UserDTO> editUserFullName(
            @Valid @RequestBody EditUserFullNameRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(userService.editUserFullName(request, user));
    }

    @Operation(
            summary = "Change password",
            description = "Changes the password for the authenticated user"
    )
    @PutMapping("/password")
    public ResponseEntity<MessageResponse> changeUserPassword(
            @Valid @RequestBody ChangeUserPasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        userService.changeUserPassword(request, user);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    @Operation(
            summary = "Change email/username",
            description = "Changes the login email/username for the authenticated user. Returns new tokens."
    )
    @PutMapping("/email")
    public ResponseEntity<RefreshResponse> changeUserLoginEmail(
            @Valid @RequestBody ChangeUserLoginEmailRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.findUserByUsername(userDetails.getUsername());
        userService.changeUserLoginEmail(request, user);
        TokenPair tokens = refreshTokenService.createNewTokensForUser(user);
        return ResponseEntity.ok(
                new RefreshResponse(tokens.getAccessToken(), tokens.getRefreshToken())
        );
    }
}
