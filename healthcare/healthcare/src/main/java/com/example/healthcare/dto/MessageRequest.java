package com.example.healthcare.dto;

import com.example.healthcare.model.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequest {
    @NotNull(message = "Receiver ID cannot be null")
    private Long receiverId;

    @NotBlank(message = "Message content cannot be blank")
    private String content;

    @NotNull(message = "Message type cannot be null")
    private MessageType type;

    // Optional fields based on message type
    private String fileUrl;        // For FILE type
    private String prescriptionDetails;  // For PRESCRIPTION type
    private String appointmentTime;      // For APPOINTMENT type
}