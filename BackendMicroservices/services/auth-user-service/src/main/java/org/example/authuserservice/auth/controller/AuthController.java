package org.example.authuserservice.auth.controller;

import com.mousiq.common.response.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.authuserservice.auth.model.request.LoginRequest;
import org.example.authuserservice.auth.model.request.RefreshRequest;
import org.example.authuserservice.auth.model.request.RegisterRequest;
import org.example.authuserservice.auth.model.response.LoginResponse;
import org.example.authuserservice.auth.model.response.RefreshResponse;
import org.example.authuserservice.auth.model.dto.TokenPair;
import org.example.authuserservice.auth.service.AuthService;
import org.example.authuserservice.auth.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "Authentication", description = "Endpoints for user authentication, including login, registration, and token management")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @Operation(
            summary = "Register new user",
            description = "Creates a new user account with the provided credentials"
    )
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("User registered successfully"));
    }

    @Operation(
            summary = "User login",
            description = "Authenticates user and returns access and refresh tokens"
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(
            summary = "Login with Google",
            description = "Authenticates user using Google OAuth ID token"
    )
    @PostMapping("/login/google")
    public ResponseEntity<LoginResponse> loginWithGoogle(@RequestBody Map<String, String> payload) {
        String idToken = payload.get("idToken");
        return ResponseEntity.ok(authService.loginViaGoogle(idToken));
    }

    @Operation(
            summary = "Refresh access token",
            description = "Generates new access and refresh tokens using a valid refresh token"
    )
    @PostMapping("/token/refresh")
    public ResponseEntity<RefreshResponse> refreshToken(@Valid @RequestBody RefreshRequest request) {
        TokenPair tokens = refreshTokenService.refreshAuthTokens(request.refreshToken());
        return ResponseEntity.ok(
                new RefreshResponse(tokens.getAccessToken(), tokens.getRefreshToken())
        );
    }
}
