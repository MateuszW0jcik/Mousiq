package org.example.mousiq.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MeResponse {
    public UUID userId;
    public String firstName;
    public String lastName;
    public String email;
    public List<String> roles;
}
