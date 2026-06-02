package com.example.healthcare.service;

import com.example.healthcare.dto.GeminiRequest;
import com.example.healthcare.model.GeminiConversation;
import com.example.healthcare.model.User;
import com.example.healthcare.model.UserRole;
import com.example.healthcare.repository.GeminiConversationRepository;
import com.example.healthcare.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Autowired
    private GeminiConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-pro}")
    private String modelName;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public GeminiConversation processChat(Long childId, GeminiRequest request) {
        User child = userRepository.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));

        if (child.getRole() != UserRole.ROLE_CHILD) {
            throw new IllegalStateException("User is not a child");
        }

        // Create conversation record
        GeminiConversation conversation = new GeminiConversation(child, request.getMessage());

        // Prepare context for AI
        StringBuilder prompt = new StringBuilder();
        prompt.append("Context: You are a helpful AI assistant talking to a child patient. ");
        prompt.append("Please respond in a caring, age-appropriate manner. ");

        if (request.getMood() != null) {
            prompt.append("The child's current mood is: ").append(request.getMood()).append(". ");
        }
        if (request.getHealthInfo() != null) {
            prompt.append("Health context: ").append(request.getHealthInfo()).append(". ");
        }
        prompt.append("\n\nChild's message: ").append(request.getMessage());
        prompt.append("\n\nPlease provide a supportive and encouraging response:");

        try {
            // Prepare request body for Gemini API
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt.toString())
                            ))
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.7,
                            "topK", 1,
                            "topP", 1,
                            "maxOutputTokens", 1000
                    )
            );

            // Call Gemini API
            String response = webClient.post()
                    .uri("/v1/models/" + modelName + ":generateContent?key=" + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // Parse response
            JsonNode jsonResponse = objectMapper.readTree(response);
            String aiResponse = jsonResponse
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            // Save response
            conversation.setAiResponse(aiResponse);

            // Analyze sentiment (simplified version)
            String sentiment = analyzeSentiment(request.getMessage());
            conversation.setSentiment(sentiment);

            // Generate context summary
            String contextSummary = generateContextSummary(request.getMessage(), aiResponse);
            conversation.setContextSummary(contextSummary);

            return conversationRepository.save(conversation);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process chat with Gemini API", e);
        }
    }

    public Page<GeminiConversation> getConversations(Long childId, int page, int size) {
        User child = userRepository.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        return conversationRepository.findByChild(child, Pageable.ofSize(size).withPage(page));
    }

    public GeminiConversation getConversation(Long conversationId, Long userId) {
        GeminiConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));

        // Verify access rights
        if (!conversation.getChild().getId().equals(userId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            if (user.getRole() != UserRole.ROLE_PARENT) {
                throw new IllegalStateException("User does not have access to this conversation");
            }
        }

        return conversation;
    }

    public List<GeminiConversation> getConversationsByDateRange(Long childId, LocalDateTime startDate, LocalDateTime endDate) {
        User child = userRepository.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        return conversationRepository.findByChildAndTimestampBetweenOrderByTimestampDesc(child, startDate, endDate);
    }

    public List<GeminiConversation> getConversationsBySentiment(Long childId, String sentiment) {
        User child = userRepository.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        return conversationRepository.findByChildAndSentimentOrderByTimestampDesc(child, sentiment);
    }

    public List<GeminiConversation> searchConversations(Long childId, String keyword) {
        User child = userRepository.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        return conversationRepository.findByChildAndKeyword(child, keyword);
    }

    public Object getConversationStatistics(Long childId) {
        User child = userRepository.findById(childId)
                .orElseThrow(() -> new EntityNotFoundException("Child not found"));
        return conversationRepository.getConversationStatistics(child);
    }

    @Transactional
    public void deleteConversation(Long conversationId, Long userId) {
        GeminiConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));

        if (!conversation.getChild().getId().equals(userId)) {
            throw new IllegalStateException("User is not authorized to delete this conversation");
        }

        conversationRepository.delete(conversation);
    }

    private String analyzeSentiment(String text) {
        // Simplified sentiment analysis
        // In a real implementation, this would use a more sophisticated sentiment analysis service
        text = text.toLowerCase();
        if (text.contains("happy") || text.contains("good") || text.contains("great") ||
                text.contains("excited") || text.contains("love") || text.contains("awesome")) {
            return "POSITIVE";
        } else if (text.contains("sad") || text.contains("bad") || text.contains("angry") ||
                text.contains("hurt") || text.contains("scared") || text.contains("worried")) {
            return "NEGATIVE";
        }
        return "NEUTRAL";
    }

    private String generateContextSummary(String userMessage, String aiResponse) {
        // Simplified context summary generation
        // In a real implementation, this would use more sophisticated NLP techniques
        return String.format("User expressed: %s\nAI provided support regarding: %s",
                userMessage.substring(0, Math.min(50, userMessage.length())),
                aiResponse.substring(0, Math.min(50, aiResponse.length())));
    }
}