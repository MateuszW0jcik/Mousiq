package org.example.mousiq.auth.repository;

import org.example.mousiq.auth.model.entity.RefreshToken;
import org.example.mousiq.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findRefreshTokenByUser(User user);
}
