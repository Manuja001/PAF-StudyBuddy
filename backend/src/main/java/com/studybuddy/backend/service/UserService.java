package com.studybuddy.backend.service;

import java.util.List;

import com.studybuddy.backend.io.UserRequest;
import com.studybuddy.backend.io.UserResponse;;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    UserResponse getUserById(String id);

    List<UserResponse> getAllUsers();

    UserResponse updateUser(String id, UserRequest request);

    void deleteUser(String id);

    boolean existsByEmail(String email);
}