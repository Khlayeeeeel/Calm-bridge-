package com.example.healthcare.websocket;

import com.example.healthcare.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Authentication authentication = (Authentication) headerAccessor.getUser();
        
        if (authentication != null) {
            UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
            logger.info("User Connected: {}", user.getUsername());
            
            // Notify about user's online status
            UserStatusMessage status = new UserStatusMessage(
                user.getId(),
                user.getUsername(),
                "ONLINE"
            );
            
            messagingTemplate.convertAndSend("/topic/public", status);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Authentication authentication = (Authentication) headerAccessor.getUser();
        
        if (authentication != null) {
            UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
            logger.info("User Disconnected: {}", user.getUsername());
            
            // Notify about user's offline status
            UserStatusMessage status = new UserStatusMessage(
                user.getId(),
                user.getUsername(),
                "OFFLINE"
            );
            
            messagingTemplate.convertAndSend("/topic/public", status);
        }
    }
}

class UserStatusMessage {
    private Long userId;
    private String username;
    private String status; // ONLINE or OFFLINE

    public UserStatusMessage(Long userId, String username, String status) {
        this.userId = userId;
        this.username = username;
        this.status = status;
    }

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}