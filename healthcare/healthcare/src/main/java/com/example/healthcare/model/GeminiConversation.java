package com.example.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gemini_conversations")
public class GeminiConversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "child_id", nullable = false)
    private User child;

    @Column(columnDefinition = "TEXT")
    private String userMessage;

    @Column(columnDefinition = "TEXT")
    private String aiResponse;

    private LocalDateTime timestamp;

    private String sentiment;  // Store sentiment analysis of child's message

    @Column(columnDefinition = "TEXT")
    private String contextSummary;  // Summary of the conversation context

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public GeminiConversation(User child, String userMessage) {
        this.child = child;
        this.userMessage = userMessage;
        this.timestamp = LocalDateTime.now();
    }
}