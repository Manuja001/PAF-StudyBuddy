package com.studybuddy.backend.service;

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

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerUser(UserRequest request) {
        // Implement the logic to register a user

        User newUser = convertToUser(request);
        // Save the user to the database
        userRepository.save(newUser);

        return convertToUserResponse(newUser);

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
                .build();
    }

}
