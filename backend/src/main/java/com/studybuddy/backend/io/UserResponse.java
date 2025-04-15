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
public class UserResponse {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private boolean enabled;
    private String role; // e.g., "user", "admin"
    private String profilePictureUrl; // URL to the user's profile picture

    @Builder.Default
    private Date createdAt = new Date();

}
