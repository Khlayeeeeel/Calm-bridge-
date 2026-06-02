package com.example.healthcare.dto;

import com.example.healthcare.model.MessageType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String content;
    private MessageType type;
    private LocalDateTime timestamp;
    private boolean read;

    // Additional fields based on message type
    private String fileUrl;
    private String prescriptionDetails;
    private String appointmentTime;
    
    // User role-specific information
    private String senderRole;
    private String receiverRole;
    private String senderSpecialization;  // For doctors

    public MessageResponse(Long id, Long senderId, String senderName, Long receiverId, 
                          String receiverName, String content, MessageType type, 
                          LocalDateTime timestamp, boolean read) {
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.content = content;
        this.type = type;
        this.timestamp = timestamp;
        this.read = read;
    }

    // Builder pattern for optional fields
    public MessageResponse setFileInfo(String fileUrl) {
        this.fileUrl = fileUrl;
        return this;
    }

    public MessageResponse setPrescriptionInfo(String prescriptionDetails) {
        this.prescriptionDetails = prescriptionDetails;
        return this;
    }

    public MessageResponse setAppointmentInfo(String appointmentTime) {
        this.appointmentTime = appointmentTime;
        return this;
    }

    public MessageResponse setUserRoles(String senderRole, String receiverRole) {
        this.senderRole = senderRole;
        this.receiverRole = receiverRole;
        return this;
    }

    public MessageResponse setDoctorInfo(String specialization) {
        this.senderSpecialization = specialization;
        return this;
    }
}