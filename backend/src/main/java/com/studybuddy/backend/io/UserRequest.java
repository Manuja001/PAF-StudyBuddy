package com.studybuddy.backend.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {

    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String role; // e.g., "user", "admin"
    private String profilePictureUrl; // URL to the user's profile picture
    private String bio; // Short biography or description of the user
    private Number followers;
    private Number following;

    @Builder.Default
    private Date createdAt = new Date();
    @Builder.Default
    private boolean enabled = true;

}
