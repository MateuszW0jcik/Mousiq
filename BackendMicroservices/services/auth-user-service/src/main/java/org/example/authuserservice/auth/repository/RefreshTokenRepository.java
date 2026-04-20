package org.example.authuserservice.auth.repository;

import org.example.authuserservice.auth.model.entity.RefreshToken;
import org.example.authuserservice.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findRefreshTokenByUser(User user);
}
