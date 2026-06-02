package com.example.healthcare.controller;

import com.example.healthcare.dto.ApiResponse;
import com.example.healthcare.dto.GeminiRequest;
import com.example.healthcare.model.GeminiConversation;
import com.example.healthcare.model.UserRole;
import com.example.healthcare.security.UserPrincipal;
import com.example.healthcare.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GeminiController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    @PreAuthorize("hasRole('CHILD')")
    public ResponseEntity<?> chat(
            @Valid @RequestBody GeminiRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        GeminiConversation conversation = geminiService.processChat(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Chat processed successfully", conversation));
    }

    @GetMapping("/conversations")
    @PreAuthorize("hasRole('CHILD') or hasRole('PARENT')")
    public ResponseEntity<?> getConversations(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<GeminiConversation> conversations = geminiService.getConversations(currentUser.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved successfully", conversations));
    }

    @GetMapping("/conversations/{conversationId}")
    @PreAuthorize("hasRole('CHILD') or hasRole('PARENT')")
    public ResponseEntity<?> getConversation(
            @PathVariable Long conversationId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        GeminiConversation conversation = geminiService.getConversation(conversationId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Conversation retrieved successfully", conversation));
    }

    @GetMapping("/conversations/date-range")
    @PreAuthorize("hasRole('CHILD') or hasRole('PARENT')")
    public ResponseEntity<?> getConversationsByDateRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<GeminiConversation> conversations = geminiService.getConversationsByDateRange(
            currentUser.getId(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved successfully", conversations));
    }

    @GetMapping("/conversations/sentiment/{sentiment}")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getConversationsBySentiment(
            @PathVariable String sentiment,
            @RequestParam Long childId) {
        List<GeminiConversation> conversations = geminiService.getConversationsBySentiment(childId, sentiment);
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved successfully", conversations));
    }

    @GetMapping("/conversations/search")
    @PreAuthorize("hasRole('CHILD') or hasRole('PARENT')")
    public ResponseEntity<?> searchConversations(
            @RequestParam String keyword,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<GeminiConversation> conversations = geminiService.searchConversations(currentUser.getId(), keyword);
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved successfully", conversations));
    }

    @GetMapping("/conversations/statistics")
    @PreAuthorize("hasRole('PARENT')")
    public ResponseEntity<?> getConversationStatistics(@RequestParam Long childId) {
        Object statistics = geminiService.getConversationStatistics(childId);
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", statistics));
    }

    @DeleteMapping("/conversations/{conversationId}")
    @PreAuthorize("hasRole('CHILD') or hasRole('PARENT')")
    public ResponseEntity<?> deleteConversation(
            @PathVariable Long conversationId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        geminiService.deleteConversation(conversationId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Conversation deleted successfully"));
    }
}