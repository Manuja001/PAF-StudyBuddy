package com.studybuddy.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.studybuddy.backend.io.UserRequest;
import com.studybuddy.backend.io.UserResponse;
import com.studybuddy.backend.model.User;
import com.studybuddy.backend.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImp implements UserService {

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerUser(UserRequest request) {

        User newUser = convertToUser(request);

        userRepository.save(newUser);

        return convertToUserResponse(newUser);

    }

    @Override
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return convertToUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUser(String id, UserRequest request) {
        // Implement the logic to update a user
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnabled(request.isEnabled());
        user.setRole(request.getRole());
        user.setEmail(request.getEmail());
        user.setProfilePictureUrl(request.getProfilePictureUrl());
        user.setBio(request.getBio());
        userRepository.save(user);
        return convertToUserResponse(user);
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    private User convertToUser(UserRequest request) {
        // Convert UserRequest to User entity
        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(request.isEnabled())
                .role(request.getRole())
                .profilePictureUrl(request.getProfilePictureUrl())
                .createdAt(request.getCreatedAt())
                .bio(request.getBio())
                .build();

    }

    private UserResponse convertToUserResponse(User user) {
        // Convert User entity to UserResponse
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(user.isEnabled())
                .role(user.getRole())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .bio(user.getBio())
                .build();
    }

    public User saveOAuth2User(String email, String firstName, String lastName, String profilePictureUrl) {
        User user = userRepository.findByEmail(email).orElseGet(() -> User.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .profilePictureUrl(profilePictureUrl)
                .enabled(true)
                .role("user") // Default role
                .build());

        // Update details if changed
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setProfilePictureUrl(profilePictureUrl);

        return userRepository.save(user);
    }

}
