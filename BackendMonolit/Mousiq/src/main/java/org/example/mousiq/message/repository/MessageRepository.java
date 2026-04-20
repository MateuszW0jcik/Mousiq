package org.example.mousiq.message.repository;

import org.example.mousiq.message.model.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    boolean existsMessageByEmail(String email);
}
