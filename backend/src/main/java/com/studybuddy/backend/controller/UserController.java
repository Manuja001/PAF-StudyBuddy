package com.studybuddy.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.studybuddy.backend.io.UserRequest;
import com.studybuddy.backend.io.UserResponse;
import com.studybuddy.backend.service.UserService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@AllArgsConstructor
@RequestMapping("/api")

public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public UserResponse register(@RequestBody UserRequest request) {
        // check if user already exists
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }

        return userService.registerUser(request);
    }

    @GetMapping("/users/{id}")
    public UserResponse getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("users/{id}")
    public UserResponse updateUser(@PathVariable String id, @RequestBody UserRequest request) {
        return userService.updateUser(id, request);

    }

    @DeleteMapping("users/{id}")
    public String deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }

}
