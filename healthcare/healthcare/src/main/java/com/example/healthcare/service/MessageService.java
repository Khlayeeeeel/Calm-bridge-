package com.example.healthcare.service;

import com.example.healthcare.dto.MessageRequest;
import com.example.healthcare.dto.MessageResponse;
import com.example.healthcare.model.Message;
import com.example.healthcare.model.User;
import com.example.healthcare.repository.MessageRepository;
import com.example.healthcare.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MessageResponse sendMessage(Long senderId, MessageRequest messageRequest) {
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new EntityNotFoundException("Sender not found"));

        User receiver = userRepository.findById(messageRequest.getReceiverId())
            .orElseThrow(() -> new EntityNotFoundException("Receiver not found"));

        Message message = new Message(sender, receiver, messageRequest.getContent(), messageRequest.getType());
        message = messageRepository.save(message);

        return convertToMessageResponse(message);
    }

    public Page<MessageResponse> getChatHistory(Long userId1, Long userId2, int page, int size) {
        User user1 = userRepository.findById(userId1)
            .orElseThrow(() -> new EntityNotFoundException("User 1 not found"));
        User user2 = userRepository.findById(userId2)
            .orElseThrow(() -> new EntityNotFoundException("User 2 not found"));

        Page<Message> messages = messageRepository.findChatHistory(user1, user2, PageRequest.of(page, size));
        List<MessageResponse> messageResponses = messages.getContent().stream()
            .map(this::convertToMessageResponse)
            .collect(Collectors.toList());

        return new PageImpl<>(messageResponses, messages.getPageable(), messages.getTotalElements());
    }

    public List<MessageResponse> getUnreadMessages(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return messageRepository.findByReceiverAndReadFalseOrderByTimestampDesc(user).stream()
            .map(this::convertToMessageResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse markMessageAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (!message.getReceiver().getId().equals(userId)) {
            throw new IllegalStateException("User is not the receiver of this message");
        }

        message.setRead(true);
        message = messageRepository.save(message);

        return convertToMessageResponse(message);
    }

    public List<MessageResponse> getMessageHistory(Long userId1, Long userId2, LocalDateTime startDate, LocalDateTime endDate) {
        User user1 = userRepository.findById(userId1)
            .orElseThrow(() -> new EntityNotFoundException("User 1 not found"));
        User user2 = userRepository.findById(userId2)
            .orElseThrow(() -> new EntityNotFoundException("User 2 not found"));

        return messageRepository.findBySenderAndReceiverAndTimestampBetween(user1, user2, startDate, endDate).stream()
            .map(this::convertToMessageResponse)
            .collect(Collectors.toList());
    }

    public List<MessageResponse> getLatestConversations(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Get latest message for each conversation partner
        return userRepository.findAll().stream()
            .filter(other -> !other.getId().equals(userId))
            .map(other -> messageRepository.findLatestMessage(user, other, PageRequest.of(0, 1)))
            .filter(messages -> !messages.isEmpty())
            .map(messages -> convertToMessageResponse(messages.get(0)))
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteMessage(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (!message.getSender().getId().equals(userId)) {
            throw new IllegalStateException("User is not the sender of this message");
        }

        messageRepository.delete(message);
    }

    private MessageResponse convertToMessageResponse(Message message) {
        MessageResponse response = new MessageResponse(
            message.getId(),
            message.getSender().getId(),
            message.getSender().getUsername(),
            message.getReceiver().getId(),
            message.getReceiver().getUsername(),
            message.getContent(),
            message.getType(),
            message.getTimestamp(),
            message.isRead()
        );

        // Set user roles
        response.setUserRoles(
            message.getSender().getRole().name(),
            message.getReceiver().getRole().name()
        );

        // Set doctor specialization if applicable
        if (message.getSender().getSpecialization() != null) {
            response.setDoctorInfo(message.getSender().getSpecialization());
        }

        return response;
    }
}