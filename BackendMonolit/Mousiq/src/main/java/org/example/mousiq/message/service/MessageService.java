package org.example.mousiq.message.service;

import lombok.RequiredArgsConstructor;
import org.example.mousiq.message.model.dto.MessageDTO;
import org.example.mousiq.message.model.entity.Message;
import org.example.mousiq.common.exception.BadRequestException;
import org.example.mousiq.common.exception.NotFoundException;
import org.example.mousiq.message.model.request.MessageRequest;
import org.example.mousiq.common.response.PageResponse;
import org.example.mousiq.message.repository.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    @Transactional
    public MessageDTO createMessage(MessageRequest request) {
        if (exitsMessageByEmail(request.email())) {
            throw new BadRequestException("Your last message is still waiting for the administrator to review it.");
        }
        if (request.email().isEmpty() || request.name().isEmpty()) {
            throw new BadRequestException("Invalid name or email.");
        }
        Message message = Message.builder()
                .content(request.content())
                .name(request.name())
                .email(request.email())
                .sentAt(Instant.now()).build();
        return new MessageDTO(saveMessage(message));
    }

    @Transactional
    public void deleteMessage(UUID id) {
        Message message = findMessageById(id);

        messageRepository.delete(message);
    }

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public boolean exitsMessageByEmail(String email) {
        return messageRepository.existsMessageByEmail(email);
    }

    public Message findMessageById(UUID id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Message with id: " + id + " do not exist"));
    }

    public PageResponse<MessageDTO> getMessages(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Message> messages = messageRepository.findAll(pageable);

        List<MessageDTO> content = messages.getContent()
                .stream()
                .map(MessageDTO::new)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                messages.getNumber(),
                messages.getSize(),
                messages.getTotalElements(),
                messages.getTotalPages(),
                messages.isLast());
    }
}
