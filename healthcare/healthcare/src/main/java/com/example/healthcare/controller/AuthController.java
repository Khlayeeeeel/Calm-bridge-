package com.example.healthcare.controller;

import com.example.healthcare.dto.*;
import com.example.healthcare.model.User;
import com.example.healthcare.security.JwtUtils;
import com.example.healthcare.security.UserPrincipal;
import com.example.healthcare.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.getUserById(userPrincipal.getId());

        JwtResponse response = new JwtResponse(
            jwt,
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getFullName()
        );

        // Add role-specific information
        switch (user.getRole()) {
            case ROLE_DOCTOR:
                response.setDoctorInfo(user.getSpecialization());
                break;
            case ROLE_CHILD:
                response.setChildInfo(user.getAge(), user.getParentName());
                break;
            case ROLE_PARENT:
                response.setParentInfo(user.getRelationship());
                break;
        }

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error", "Username is already taken!", "/api/auth/signup"));
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error", "Email is already in use!", "/api/auth/signup"));
        }

        User user = userService.createUser(signUpRequest);

        return ResponseEntity.ok(ApiResponse.success("User registered successfully", user));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken() {
        // This endpoint will automatically verify the token through security filters
        return ResponseEntity.ok(ApiResponse.success("Token is valid"));
    }
}