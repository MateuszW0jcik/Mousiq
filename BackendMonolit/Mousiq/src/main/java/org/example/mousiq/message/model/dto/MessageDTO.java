package org.example.mousiq.message.model.dto;

import lombok.*;
import org.example.mousiq.message.model.entity.Message;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private UUID id;
    private String content;
    private Instant sentAt;
    private String name;
    private String email;

    public MessageDTO(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.sentAt = message.getSentAt();
        this.name = message.getName();
        this.email = message.getEmail();
    }
}
