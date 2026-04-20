package com.mousiq.common.dto.contact;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminContactDTO {
    private UUID id;
    private UUID userId;
    private String email;
    private String phoneNumber;
}
