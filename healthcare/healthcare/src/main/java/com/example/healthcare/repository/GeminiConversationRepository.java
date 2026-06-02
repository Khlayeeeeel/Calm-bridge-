package com.example.healthcare.repository;

import com.example.healthcare.model.GeminiConversation;
import com.example.healthcare.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GeminiConversationRepository extends JpaRepository<GeminiConversation, Long> {
    
    // Find all conversations for a specific child
    List<GeminiConversation> findByChildOrderByTimestampDesc(User child);
    
    // Find conversations by date range
    List<GeminiConversation> findByChildAndTimestampBetweenOrderByTimestampDesc(
        User child,
        LocalDateTime startDate,
        LocalDateTime endDate
    );
    
    // Find conversations with specific sentiment
    List<GeminiConversation> findByChildAndSentimentOrderByTimestampDesc(User child, String sentiment);
    
    // Find paginated conversations for a child
    Page<GeminiConversation> findByChild(User child, Pageable pageable);
    
    // Find conversations containing specific keywords
    @Query("SELECT g FROM GeminiConversation g WHERE g.child = ?1 AND (g.userMessage LIKE %?2% OR g.aiResponse LIKE %?2%)")
    List<GeminiConversation> findByChildAndKeyword(User child, String keyword);
    
    // Get conversation statistics
    @Query("SELECT COUNT(g), g.sentiment FROM GeminiConversation g WHERE g.child = ?1 GROUP BY g.sentiment")
    List<Object[]> getConversationStatistics(User child);
}