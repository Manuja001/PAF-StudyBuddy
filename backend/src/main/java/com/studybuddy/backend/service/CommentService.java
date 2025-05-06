package com.studybuddy.backend.service;

import com.studybuddy.backend.model.Comment;
import com.studybuddy.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // Create a new comment
    public Comment createComment(Comment comment) {
        // comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Get all comments for a specific post
    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    // Get a specific comment by ID
    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    // Update a comment
    public Comment updateComment(String id, Comment comment) {
        Optional<Comment> existingComment = commentRepository.findById(id);
        if (existingComment.isPresent()) {
            Comment updatedComment = existingComment.get();
            updatedComment.setContent(comment.getContent());
            updatedComment.setUpdatedAt(LocalDateTime.now());
            return commentRepository.save(updatedComment);
        }
        return null;
    }

    // Delete a comment
    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }
}