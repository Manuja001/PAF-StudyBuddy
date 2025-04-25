package com.studybuddy.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class User {
    @Id
    private String id; // Unique identifier for the user

    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private boolean enabled;
    private String role; // e.g., "user", "admin"
    private String profilePictureUrl; // URL to the user's profile picture
    private String bio; // Short biography or description of the user

    @Builder.Default
    private Date createdAt = new Date(); // Default to current date/time

}

// done
