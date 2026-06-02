package com.example.healthcare.websocket;

import com.example.healthcare.dto.MessageRequest;
import com.example.healthcare.dto.MessageResponse;
import com.example.healthcare.security.UserPrincipal;
import com.example.healthcare.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageRequest messageRequest, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();

        MessageResponse message = messageService.sendMessage(currentUser.getId(), messageRequest);

        // Send to specific user's queue
        messagingTemplate.convertAndSendToUser(
            message.getReceiverId().toString(),
            "/queue/messages",
            message
        );

        // Send status back to sender
        messagingTemplate.convertAndSendToUser(
            currentUser.getId().toString(),
            "/queue/message-status",
            message
        );
    }

    @MessageMapping("/chat.typing")
    public void typingNotification(@Payload TypingNotification notification, SimpMessageHeaderAccessor headerAccessor) {
        Authentication authentication = (Authentication) headerAccessor.getUser();
        UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();

        // Add user information to the notification
        notification.setUserId(currentUser.getId());
        notification.setUsername(currentUser.getUsername());

        // Send typing status to the recipient
        messagingTemplate.convertAndSendToUser(
            notification.getRecipientId().toString(),
            "/queue/typing",
            notification
        );
    }
}

class TypingNotification {
    private Long userId;
    private String username;
    private Long recipientId;
    private boolean typing;

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
    public boolean isTyping() { return typing; }
    public void setTyping(boolean typing) { this.typing = typing; }
}