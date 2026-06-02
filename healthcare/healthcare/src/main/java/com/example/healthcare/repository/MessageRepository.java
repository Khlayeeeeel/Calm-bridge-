package com.example.healthcare.repository;

import com.example.healthcare.model.Message;
import com.example.healthcare.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Find chat history between two users
    @Query("SELECT m FROM Message m WHERE (m.sender = ?1 AND m.receiver = ?2) OR (m.sender = ?2 AND m.receiver = ?1) ORDER BY m.timestamp DESC")
    Page<Message> findChatHistory(User user1, User user2, Pageable pageable);
    
    // Find unread messages for a user
    List<Message> findByReceiverAndReadFalseOrderByTimestampDesc(User receiver);
    
    // Find messages by date range
    List<Message> findBySenderAndReceiverAndTimestampBetween(
        User sender,
        User receiver,
        LocalDateTime startDate,
        LocalDateTime endDate
    );
    
    // Count unread messages for a user
    long countByReceiverAndReadFalse(User receiver);
    
    // Find latest message between two users
    @Query("SELECT m FROM Message m WHERE (m.sender = ?1 AND m.receiver = ?2) OR (m.sender = ?2 AND m.receiver = ?1) ORDER BY m.timestamp DESC")
    List<Message> findLatestMessage(User user1, User user2, Pageable pageable);
}