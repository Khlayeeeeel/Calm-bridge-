package com.example.healthcare.controller;

import com.example.healthcare.dto.ApiResponse;
import com.example.healthcare.model.User;
import com.example.healthcare.model.UserRole;
import com.example.healthcare.security.UserPrincipal;
import com.example.healthcare.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.getUserById(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", user));
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('PARENT') or hasRole('CHILD')")
    public ResponseEntity<?> getAllDoctors() {
        List<User> doctors = userService.getUsersByRole(UserRole.ROLE_DOCTOR);
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved successfully", doctors));
    }

    @GetMapping("/doctors/{specialization}")
    @PreAuthorize("hasRole('PARENT') or hasRole('CHILD')")
    public ResponseEntity<?> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<User> doctors = userService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(ApiResponse.success("Doctors retrieved successfully", doctors));
    }

    @GetMapping("/children")
    @PreAuthorize("hasRole('PARENT') or hasRole('DOCTOR')")
    public ResponseEntity<?> getAllChildren() {
        List<User> children = userService.getUsersByRole(UserRole.ROLE_CHILD);
        return ResponseEntity.ok(ApiResponse.success("Children retrieved successfully", children));
    }

    @GetMapping("/parents")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getAllParents() {
        List<User> parents = userService.getUsersByRole(UserRole.ROLE_PARENT);
        return ResponseEntity.ok(ApiResponse.success("Parents retrieved successfully", parents));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody User userUpdates) {
        User updatedUser = userService.updateUser(currentUser.getId(), userUpdates);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('PARENT')")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @GetMapping("/children/age-range")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> getChildrenByAgeRange(
            @RequestParam Integer minAge,
            @RequestParam Integer maxAge) {
        List<User> children = userService.getChildrenByAgeRange(minAge, maxAge);
        return ResponseEntity.ok(ApiResponse.success("Children retrieved successfully", children));
    }
}