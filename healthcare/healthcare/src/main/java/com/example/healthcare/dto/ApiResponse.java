package com.example.healthcare.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private String error;
    private String path;

    // Constructor for success response
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // Constructor for error response
    public ApiResponse(boolean success, String message, String error, String path) {
        this.success = success;
        this.message = message;
        this.error = error;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }

    // Static factory methods for common responses
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }

    public static <T> ApiResponse<T> error(String message, String error, String path) {
        return new ApiResponse<>(false, message, error, path);
    }

    // Builder pattern for additional fields
    public ApiResponse<T> setPath(String path) {
        this.path = path;
        return this;
    }

    public ApiResponse<T> setError(String error) {
        this.error = error;
        return this;
    }
}