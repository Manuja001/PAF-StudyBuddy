package com.studybuddy.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.studybuddy.backend.io.UserRequest;
import com.studybuddy.backend.io.UserResponse;
import com.studybuddy.backend.service.UserService;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@AllArgsConstructor
@RequestMapping("/api")

public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public UserResponse register(@RequestBody UserRequest request) {
        return userService.registerUser(request);
    }

}
