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
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    private MessageType type;

    private LocalDateTime timestamp;

    @Column(name = "`read`")
    private boolean read;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public Message(User sender, User receiver, String content, MessageType type) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.type = type;
        this.read = false;
    }
}