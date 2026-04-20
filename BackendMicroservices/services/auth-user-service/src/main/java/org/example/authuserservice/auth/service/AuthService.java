package org.example.authuserservice.auth.service;

import com.mousiq.common.exception.BadRequestException;
import com.mousiq.common.exception.InternalServerErrorException;
import com.mousiq.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.example.authuserservice.auth.model.dto.GoogleUserInfo;
import org.example.authuserservice.auth.model.entity.RefreshToken;
import org.example.authuserservice.auth.model.entity.Role;
import org.example.authuserservice.auth.model.request.LoginRequest;
import org.example.authuserservice.auth.model.request.RegisterRequest;
import org.example.authuserservice.auth.model.response.LoginResponse;
import org.example.authuserservice.auth.repository.RoleRepository;
import org.example.authuserservice.common.security.JwtTokenProvider;
import org.example.authuserservice.user.model.entity.User;
import org.example.authuserservice.user.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Value("${google.client-id}")
    private String googleClientId;

    public void register(RegisterRequest request) {
        if (userService.existsByEmail(request.email())) {
            throw new BadRequestException("Email already in use");
        }

        User user = User.builder()
                .username(request.email())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .active(true)
                .createdAt(Instant.now()).build();

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new InternalServerErrorException("Server problem"));
        user.addRole(userRole);

        userService.saveUser(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userService.findUserByEmail(request.email());

        if (!user.isActive()) {
            throw new UnauthorizedException("Your account is deactivated");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String accessToken = tokenProvider.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken()).build();
    }

    public LoginResponse loginViaGoogle(String idToken) {
        GoogleUserInfo userInfo;
        try {
            String googleApiUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            RestTemplate restTemplate = new RestTemplate();
            userInfo = restTemplate.getForObject(googleApiUrl, GoogleUserInfo.class);
        } catch (Exception ex) {
            throw new UnauthorizedException("Failed to login");
        }

        if (userInfo == null || !userInfo.getAudience().equals(googleClientId)) {
            throw new UnauthorizedException("Invalid Google ID token");
        }

        if (!userService.existsByEmail(userInfo.getEmail())) {
            register(new RegisterRequest(
                    userInfo.getGivenName(),
                    userInfo.getFamilyName(),
                    userInfo.getEmail(),
                    UUID.randomUUID().toString()
            ));
        }

        User user = userService.findUserByEmail(userInfo.getEmail());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String accessToken = tokenProvider.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken()).build();
    }
}
