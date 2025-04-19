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
<<<<<<< HEAD

    boolean existsByEmail(String email);
=======
>>>>>>> e2b9b04703d8d9638576e6741cb536dabc78740b
}