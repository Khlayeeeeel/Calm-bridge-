package com.example.healthcare.service;

import com.example.healthcare.dto.SignupRequest;
import com.example.healthcare.model.User;
import com.example.healthcare.model.UserRole;
import com.example.healthcare.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User createUser(SignupRequest signUpRequest) {
        User user = new User(
            signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            passwordEncoder.encode(signUpRequest.getPassword()),
            signUpRequest.getRole()
        );

        user.setFullName(signUpRequest.getFullName());

        // Set role-specific fields
        switch (signUpRequest.getRole()) {
            case ROLE_DOCTOR:
                user.setSpecialization(signUpRequest.getSpecialization());
                break;
            case ROLE_CHILD:
                user.setAge(signUpRequest.getAge());
                user.setParentName(signUpRequest.getParentName());
                break;
            case ROLE_PARENT:
                user.setRelationship(signUpRequest.getRelationship());
                break;
        }

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + username));
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public List<User> getDoctorsBySpecialization(String specialization) {
        return userRepository.findByRoleAndSpecialization(UserRole.ROLE_DOCTOR, specialization);
    }

    public List<User> getChildrenByAgeRange(Integer minAge, Integer maxAge) {
        return userRepository.findByRoleAndAgeBetween(UserRole.ROLE_CHILD, minAge, maxAge);
    }

    @Transactional
    public User updateUser(Long id, User userUpdates) {
        User user = getUserById(id);

        // Update basic information
        if (userUpdates.getFullName() != null) {
            user.setFullName(userUpdates.getFullName());
        }
        if (userUpdates.getEmail() != null) {
            user.setEmail(userUpdates.getEmail());
        }

        // Update role-specific information
        switch (user.getRole()) {
            case ROLE_DOCTOR:
                if (userUpdates.getSpecialization() != null) {
                    user.setSpecialization(userUpdates.getSpecialization());
                }
                break;
            case ROLE_CHILD:
                if (userUpdates.getAge() != null) {
                    user.setAge(userUpdates.getAge());
                }
                if (userUpdates.getParentName() != null) {
                    user.setParentName(userUpdates.getParentName());
                }
                break;
            case ROLE_PARENT:
                if (userUpdates.getRelationship() != null) {
                    user.setRelationship(userUpdates.getRelationship());
                }
                break;
        }

        return userRepository.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}