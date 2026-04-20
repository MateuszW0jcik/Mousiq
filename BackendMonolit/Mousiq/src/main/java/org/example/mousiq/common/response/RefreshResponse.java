package org.example.mousiq.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class RefreshResponse {
    private String accessToken;
    private String refreshToken;
}
