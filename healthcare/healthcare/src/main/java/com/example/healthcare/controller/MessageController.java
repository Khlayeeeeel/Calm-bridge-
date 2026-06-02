package com.example.healthcare.controller;

import com.example.healthcare.dto.ApiResponse;
import com.example.healthcare.dto.MessageRequest;
import com.example.healthcare.dto.MessageResponse;
import com.example.healthcare.model.Message;
import com.example.healthcare.security.UserPrincipal;
import com.example.healthcare.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void processMessage(@Payload MessageRequest messageRequest, @AuthenticationPrincipal UserPrincipal currentUser) {
        MessageResponse message = messageService.sendMessage(currentUser.getId(), messageRequest);
        
        // Send to specific user's queue
        messagingTemplate.convertAndSendToUser(
            message.getReceiverId().toString(),
            "/queue/messages",
            message
        );
    }

    @GetMapping("/chat/{userId}")
    public ResponseEntity<?> getChatHistory(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<MessageResponse> messages = messageService.getChatHistory(currentUser.getId(), userId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Chat history retrieved successfully", messages));
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadMessages(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<MessageResponse> unreadMessages = messageService.getUnreadMessages(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Unread messages retrieved successfully", unreadMessages));
    }

    @PutMapping("/read/{messageId}")
    public ResponseEntity<?> markMessageAsRead(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        MessageResponse message = messageService.markMessageAsRead(messageId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", message));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getMessageHistory(
            @RequestParam Long userId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<MessageResponse> messages = messageService.getMessageHistory(currentUser.getId(), userId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Message history retrieved successfully", messages));
    }

    @GetMapping("/latest-conversations")
    public ResponseEntity<?> getLatestConversations(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<MessageResponse> latestMessages = messageService.getLatestConversations(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Latest conversations retrieved successfully", latestMessages));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        messageService.deleteMessage(messageId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully"));
    }
}