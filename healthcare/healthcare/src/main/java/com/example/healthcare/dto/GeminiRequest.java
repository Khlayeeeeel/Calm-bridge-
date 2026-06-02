package com.example.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GeminiRequest {
    @NotBlank(message = "Message cannot be blank")
    private String message;

    // Optional context parameters
    private String mood;        // Child's current mood
    private String context;     // Additional context about the conversation
    private String parentInfo;  // Relevant information about parents
    private String healthInfo;  // Any health-related context
    
    // Conversation control parameters
    private boolean newConversation = false;  // Whether to start a new conversation
    private Long conversationId;              // ID of existing conversation to continue
    private Integer maxTokens;                // Maximum length of response
    private Float temperature = 0.7f;         // Response creativity (0.0 - 1.0)
    
    // Safety parameters
    private boolean filterSensitiveContent = true;  // Whether to filter sensitive content
    private String[] blockedTopics;                // Topics to avoid in conversation
}