package com.studybuddy.backend.service;

import com.studybuddy.backend.io.UserRequest;
import com.studybuddy.backend.io.UserResponse;;

public interface UserService {

    UserResponse registerUser(UserRequest request);
}