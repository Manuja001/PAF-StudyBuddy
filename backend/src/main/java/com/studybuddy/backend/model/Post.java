package com.studybuddy.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "posts")
@Data
@AllArgsConstructor
public class Post {
    @Id
    private String id;
    private String email;
    private String title;
    private String content;
    private String skillLevel;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> likedBy = new HashSet<>();

    public Post() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getemail() {
        return email;
    }

    public void setemail(String setemail) {
        this.email = setemail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<String> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(Set<String> likedBy) {
        this.likedBy = likedBy;
    }

    public boolean toggleLike(String userId) {
        if (likedBy.contains(userId)) {
            likedBy.remove(userId);
            return false;
        } else {
            likedBy.add(userId);
            return true;
        }
    }
}