package org.example.mousiq.auth.service;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.auth.model.dto.TokenPair;
import org.example.mousiq.auth.model.entity.RefreshToken;
import org.example.mousiq.user.model.entity.User;
import org.example.mousiq.common.exception.UnauthorizedException;
import org.example.mousiq.auth.repository.RefreshTokenRepository;
import org.example.mousiq.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${refresh.expiration}")
    private long refreshTokenDurationMs;

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token expired");
        }
        return token;
    }
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        Optional<RefreshToken> refreshToken = findRefreshTokenByUser(user);
        if (refreshToken.isPresent()) {
            RefreshToken refreshToken1 = refreshToken.get();
            refreshToken1.setToken(UUID.randomUUID().toString());
            refreshToken1.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
            return saveRefreshToken(refreshToken1);
        } else {
            return refreshTokenRepository.save(
                    RefreshToken.builder()
                            .user(user)
                            .token(UUID.randomUUID().toString())
                            .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                            .build()
            );
        }
    }
    @Transactional
    public TokenPair refreshAuthTokens(String refreshToken) {
        RefreshToken verifiedToken = refreshTokenRepository.findByToken(refreshToken)
                .map(this::verifyExpiration)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        User user = verifiedToken.getUser();
        String newAccessToken = jwtTokenProvider.generateToken(user);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return new TokenPair(newAccessToken, newRefreshToken.getToken());
    }
    @Transactional
    public TokenPair createNewTokensForUser(User user){
        String newAccessToken = jwtTokenProvider.generateToken(user);
        RefreshToken newRefreshToken = createRefreshToken(user);

        return new TokenPair(newAccessToken, newRefreshToken.getToken());
    }

    public Optional<RefreshToken> findRefreshTokenByUser(User user) {
        return refreshTokenRepository.findRefreshTokenByUser(user);
    }

    public RefreshToken saveRefreshToken(RefreshToken refreshToken) {
        return refreshTokenRepository.save(refreshToken);
    }
}
