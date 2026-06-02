package com.example.healthcare.repository;

import com.example.healthcare.model.User;
import com.example.healthcare.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    // Find doctors by specialization
    List<User> findByRoleAndSpecialization(UserRole role, String specialization);
    
    // Find children by age range
    List<User> findByRoleAndAgeBetween(UserRole role, Integer minAge, Integer maxAge);
}