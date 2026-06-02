package com.example.healthcare.dto;

import com.example.healthcare.model.UserRole;
import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private String fullName;
    
    // Role-specific fields
    private String specialization;  // For doctors
    private Integer age;           // For children
    private String parentName;     // For children
    private String relationship;   // For parents

    public JwtResponse(String token, Long id, String username, String email, 
                       UserRole role, String fullName) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
    }

    // Builder pattern for optional fields
    public JwtResponse setDoctorInfo(String specialization) {
        this.specialization = specialization;
        return this;
    }

    public JwtResponse setChildInfo(Integer age, String parentName) {
        this.age = age;
        this.parentName = parentName;
        return this;
    }

    public JwtResponse setParentInfo(String relationship) {
        this.relationship = relationship;
        return this;
    }
}